# TailorHub Seed Credentials

All users are created in Firebase Auth and Firestore. Run `node scripts/seed.mjs` to re-seed.

## Admin

| Field    | Value               |
|----------|---------------------|
| Email    | admin@tailorhub.dev |
| Password | TH!l0rHub@Adm#2025  |
| Role     | admin               |
| Status   | active              |
| UID      | admin_seed_01       |

## Tailors

| Name          | Email                | Password     | Status           | UID            |
|---------------|----------------------|--------------|------------------|----------------|
| Kareem Master | kareem@tailorhub.dev | SeedUser@123 | active           | tailor_seed_01 |
| Ali Stitches  | ali@tailorhub.dev    | SeedUser@123 | pending_approval | tailor_seed_02 |

## Customers

| Name        | Email              | Password     | Status | UID              |
|-------------|--------------------|--------------|--------|------------------|
| Ayesha Khan | ayesha@example.com | SeedUser@123 | active | customer_seed_01 |
| Bilal Ahmed | bilal@example.com  | SeedUser@123 | active | customer_seed_02 |

## Delivery

| Name        | Email               | Password     | Status | UID              |
|-------------|---------------------|--------------|--------|------------------|
| Usman Rider | rider@tailorhub.dev | SeedUser@123 | active | delivery_seed_01 |

## Seeded Collections

| Collection          | Documents                                        |
|---------------------|--------------------------------------------------|
| users               | 6 (admin, 2 tailors, 2 customers, 1 delivery)   |
| customers           | 3 (cust_01, cust_02, cust_03)                   |
| measurements        | 1 (m_01 for Ayesha Khan)                        |
| orders              | 3 (in_progress, pending, measurement_needed)     |
| inventory           | 5 items (fabric, buttons, thread, zippers, silk)|
| deliveries          | 1 (del_01 assigned to Usman Rider)              |
| measurementRequests | 1 (pending for Bilal Ahmed)                     |
| notifications       | 2 (one for customer, one for tailor)            |
