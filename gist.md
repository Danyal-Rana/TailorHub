# TailorHub

**One-liner:** A full-stack tailor shop management platform that digitises order tracking, customer measurements, inventory, and delivery workflows — with role-based access and real-time notifications.

---

## 1. Project Overview

### The Problem
Traditional tailor shops run entirely on paper registers and WhatsApp messages. Orders get lost, measurements are stored in notebooks that walk out the door, customers have no visibility into their order status, and owners have zero analytics on revenue or stock levels.

### The Solution
TailorHub replaces the paper-based workflow with a web platform where every actor — admin, tailor, customer, delivery rider — has a role-specific dashboard. Orders move through a defined lifecycle, measurements are stored against customers with versioning, inventory is tracked with low-stock alerts, and every status change triggers a real-time notification to the right person.

### Key Value Proposition
- **Zero lag notifications** — Redis Pub/Sub via Server-Sent Events delivers order updates sub-second, without polling.
- **Firestore cost reduction** — Order list queries are cached in Redis (60 s TTL), cutting Firestore reads on every page load.
- **Multi-role access** — One codebase, four distinct experiences (admin / tailor / customer / delivery) enforced at both the UI and Firestore security rules level.
- **Urdu-first measurements** — Measurement fields are labelled in Urdu (قمیض / شلوار) to match the native vocabulary of the tailor trade in Pakistan.

---

## 2. Tech Stack

| Category | Technology |
|---|---|
| **Language** | TypeScript |
| **Framework** | Next.js 16 (App Router) |
| **UI Library** | React 19, Tailwind CSS, Framer Motion |
| **Auth & Database** | Firebase Authentication, Cloud Firestore |
| **Cache / Pub-Sub** | Upstash Redis (REST API via `@upstash/redis`) |
| **Media Storage** | Cloudinary |
| **Charts** | Recharts |
| **Forms & Validation** | React Hook Form, Zod |
| **E2E Testing** | Playwright |
| **Deployment** | Vercel |

---

## 3. System Architecture

### High-Level Design
Server-side rendered Next.js app with App Router. All Firestore reads and writes happen client-side using the Firebase JS SDK, secured by Firestore Security Rules. Redis operations are server-side only — proxied through Next.js API Routes so Upstash credentials are never exposed to the browser.

### Architectural Diagram

```
┌─────────────────────────────────────────────────────────┐
│                      Browser Client                     │
│  React 19 · Next.js App Router · Tailwind CSS          │
│                                                         │
│   ┌──────────────┐   ┌───────────────────────────────┐ │
│   │ Firebase SDK │   │  fetch() → Next.js API Routes │ │
│   │ (Firestore   │   │  /api/orders/cache            │ │
│   │  + Auth)     │   │  /api/notifications/stream    │ │
│   └──────┬───────┘   │  /api/notifications/publish   │ │
│          │           └──────────────┬────────────────┘ │
└──────────┼──────────────────────────┼──────────────────┘
           │                          │
           ▼                          ▼
┌──────────────────┐      ┌───────────────────────┐
│  Google Firebase │      │   Upstash Redis        │
│  ─────────────── │      │  ──────────────────── │
│  Firestore DB    │      │  Orders cache (60 s)   │
│  Authentication  │      │  Notif queue per uid   │
│  Security Rules  │      │  (LIST, 1 h TTL)       │
└──────────────────┘      └───────────────────────┘
           │
           ▼
┌──────────────────┐
│    Cloudinary    │
│  Image uploads   │
│  (fabric, design │
│   avatars)       │
└──────────────────┘
```

### Data Flow

**Order caching:**
1. Client calls `GET /api/orders/cache?key=orders:all`
2. API route checks Redis — on hit, returns cached array instantly
3. On miss, client falls back to Firestore `getDocs`, then calls `POST /api/orders/cache` to populate Redis
4. `createOrder` / `updateOrderStatus` call `DELETE /api/orders/cache` to invalidate stale keys

**Real-time notifications (Pub/Sub via Redis LIST):**
1. `createNotification()` writes to Firestore **and** calls `POST /api/notifications/publish`
2. The publish route does `LPUSH notif:{uid}` in Redis (TTL 1 h)
3. `useNotifications` hook opens `EventSource` to `GET /api/notifications/stream?uid={uid}`
4. The stream route polls `RPOP notif:{uid}` every 2 s and flushes events as SSE
5. Client deduplicates against the Firestore `onSnapshot` subscription (which handles read/unread state)

---

## 4. Main Modules & Features

### Module A — Order Lifecycle Management
Full CRUD for orders with an eight-stage status pipeline: `pending → measurement_needed → in_progress → ready → out_for_delivery → delivered → cancelled`. Each transition auto-notifies the customer and invalidates the Redis order cache.

### Module B — Customer & Measurement Management
Customer profiles linked to user accounts. Measurements stored per customer with versioning, supporting three dress types: **Kameez (قمیض)**, **Shalwar (شلوار)**, and **Shalwar Kameez (شلوار قمیض)** — each with its own dedicated field set and Urdu labels. Tailors can submit measurement retake requests with scheduling.

### Module C — Role-Based Access Control
Four roles enforced end-to-end:
- **Admin** — full platform access, user approval/rejection, analytics dashboard
- **Tailor** — order management, measurements, inventory
- **Customer** — own orders and measurements only
- **Delivery** — assigned deliveries only

Firestore Security Rules mirror every UI permission so rules cannot be bypassed from outside the app.

### Module D — Inventory Management
Track fabric, buttons, thread, zippers, and other materials with stock levels, units, minimum thresholds, supplier info, and image attachments. Dashboard surfaces low-stock alerts automatically.

### Module E — Delivery Management
Admins dispatch delivery items linked to orders. Riders update status (`unassigned → assigned → in_transit → completed`), upload proof-of-delivery images via Cloudinary, and see only their assigned items.

### Module F — Real-Time Notification System
Dual delivery channel: Firestore `onSnapshot` (persistent WebSocket, handles read/unread sync) + Redis Pub/Sub via SSE (delivers new notifications in ≤ 2 s before Firestore propagates). Bell icon in the nav shows unread count, dropdown shows last 5 with mark-as-read.

### Module G — Analytics Dashboard
Admin dashboard: total revenue, orders, customer count, pending approvals, order volume line chart, order status pie chart — rendered with Recharts. Tailor dashboard: active orders, pending measurements, ready-for-pickup count, recent order list.

---

## 6. Database Schema

### Firestore Collections

| Collection | Key Fields |
|---|---|
| `users` | `uid`, `email`, `phone`, `displayName`, `role`, `status`, `authProviders`, `approvedBy` |
| `customers` | `id`, `linkedUserId`, `name`, `phone`, `email`, `address`, `createdBy` |
| `measurements` | `id`, `customerId`, `takenBy`, `dressType`, `kameezLength/Shoulder/Sleeves/Neck/Chest/Waist/Armhole/Cuff`, `shalwarLength/Width/Pancha`, `unit`, `version`, `customNotes[]` |
| `orders` | `id`, `customerId`, `customerUid`, `measurementId`, `assignedTailor`, `dressType`, `fabricDetails`, `fabricImages[]`, `designImages[]`, `price`, `advancePaid`, `status`, `pickupDate`, `deliveryDate` |
| `inventory` | `id`, `name`, `category`, `stock`, `unit`, `minStock`, `pricePerUnit`, `supplier`, `imageURL` |
| `deliveries` | `id`, `orderId`, `type`, `riderId`, `status`, `pickupAddress`, `dropAddress`, `scheduledAt`, `proofImageURL` |
| `notifications` | `id`, `recipientUid`, `type`, `title`, `body`, `link`, `isRead`, `metadata` |
| `measurementRequests` | `id`, `customerId`, `requestedBy`, `reason`, `status`, `scheduledFor`, `assignedTailor` |

### Redis Keys

| Key Pattern | Type | TTL | Purpose |
|---|---|---|---|
| `orders:all` | String (JSON) | 60 s | Cached order list for admin / tailor |
| `orders:customer:{uid}` | String (JSON) | 60 s | Cached order list for customer |
| `orders:delivery:{uid}` | String (JSON) | 60 s | Cached order list for delivery rider |
| `notif:{uid}` | List | 1 h | Notification pub/sub queue per user |

Firestore was chosen over a relational DB for its real-time `onSnapshot` capability and tight Firebase Auth integration. Measurements use a flat denormalised schema (no joins) to keep reads simple and cost-efficient.

---

## 7. Deployment & DevOps

### Strategy
- **Platform:** Vercel — `output: 'standalone'` Next.js build, auto-deployed on push to `main`
- **Environment variables:** Firebase config (public), Cloudinary credentials (server), Upstash Redis REST URL + token (server-only, no `NEXT_PUBLIC_` prefix)
- **E2E Testing:** Playwright test suite covering the measurements flow (`tests/e2e/`)
- **Firestore Security Rules:** Version-controlled in `firestore.rules`, deployed via Firebase CLI
- **Auth providers:** Email/password, Google OAuth, Phone (SMS via RecaptchaVerifier)

### Live Demo
[Insert Vercel URL here]

### API Endpoints

| Method | Route | Purpose |
|---|---|---|
| `GET` | `/api/orders/cache?key={key}` | Read cached order list from Redis |
| `POST` | `/api/orders/cache` | Write order list to Redis cache |
| `DELETE` | `/api/orders/cache?key={key}` | Invalidate a cached order list |
| `POST` | `/api/notifications/publish` | Push notification payload to Redis LIST |
| `GET` | `/api/notifications/stream?uid={uid}` | SSE stream — polls Redis and delivers notifications in real time |

---

## 8. Repository Access

> The source code for this project is currently in a **Private Repository**. If you are a recruiter, hiring manager, or potential collaborator and wish to review the codebase, please contact me at **ranadanyalarshad@gmail.com**. I will be happy to add you as a collaborator.
