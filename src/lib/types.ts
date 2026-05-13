import { Timestamp } from 'firebase/firestore';

export type Role = 'admin' | 'tailor' | 'customer' | 'delivery';
export type UserStatus = 'active' | 'pending_approval' | 'rejected' | 'suspended';

export interface AppUser {
  uid: string;
  email: string | null;
  phone: string | null;
  displayName: string;
  photoURL: string | null;
  role: Role;
  status: UserStatus;
  authProviders: string[];
  address: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  approvedBy: string | null;
  approvedAt: Timestamp | null;
}

export interface Customer {
  id: string;
  linkedUserId: string | null;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  photoURL: string | null;
  createdBy: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type DressType = 'kameez' | 'shalwar' | 'shalwar_kameez' | 'other';

export interface CustomNote {
  title: string;
  description: string;
}

export interface Measurement {
  id: string;
  customerId: string;
  takenBy: string;
  dressType?: DressType;
  // Kameez / قمیض
  kameezLength?: number | null;
  kameezShoulder?: number | null;
  kameezSleeves?: number | null;
  kameezNeck?: number | null;
  kameezChest?: number | null;
  kameezWaist?: number | null;
  kameezArmhole?: number | null;
  kameezCuff?: number | null;
  kameezCuffWidth?: number | null;
  // Shalwar / شلوار
  shalwarLength?: number | null;
  shalwarWidth?: number | null;
  shalwarPancha?: number | null;
  // Legacy generic fields
  chest?: number | null;
  waist?: number | null;
  hips?: number | null;
  shoulder?: number | null;
  sleeves?: number | null;
  length?: number | null;
  inseam?: number | null;
  neck?: number | null;
  notes: string;
  customNotes?: CustomNote[];
  unit: 'inches' | 'cm';
  version: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export type OrderStatus =
  | 'pending'
  | 'measurement_needed'
  | 'in_progress'
  | 'ready'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id: string;
  customerId: string;
  customerUid: string | null;
  customerName?: string;
  measurementId: string | null;
  assignedTailor: string | null;
  dressType: string;
  fabricDetails: string;
  fabricImages: string[];
  designImages: string[];
  price: number;
  advancePaid: number;
  status: OrderStatus;
  pickupDate: Timestamp | null;
  pickupBy: string | null;
  deliveryDate: Timestamp | null;
  deliveryBy: string | null;
  notes: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: 'Fabric' | 'Button' | 'Thread' | 'Zipper' | 'Other';
  stock: number;
  unit: 'meters' | 'pieces' | 'spools' | 'yards';
  minStock: number;
  pricePerUnit: number;
  supplier: string;
  imageURL: string | null;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface DeliveryItem {
  id: string;
  orderId: string;
  type: 'pickup' | 'delivery';
  riderId: string | null;
  status: 'unassigned' | 'assigned' | 'in_transit' | 'completed' | 'failed';
  pickupAddress: string;
  dropAddress: string;
  scheduledAt: Timestamp;
  completedAt: Timestamp | null;
  proofImageURL: string | null;
  createdAt: Timestamp;
}

export interface Notification {
  id: string;
  recipientUid: string;
  type:
    | 'order_status'
    | 'new_order'
    | 'pickup_assigned'
    | 'delivery_arriving'
    | 'measurement_request'
    | 'approval_status'
    | 'system';
  title: string;
  body: string;
  link: string | null;
  isRead: boolean;
  metadata: Record<string, unknown>;
  createdAt: Timestamp;
}

export interface MeasurementRequest {
  id: string;
  customerId: string;
  requestedBy: string;
  reason: 'retake' | 'update' | 'first_time';
  message: string;
  status: 'pending' | 'scheduled' | 'completed' | 'rejected';
  scheduledFor: Timestamp | null;
  assignedTailor: string | null;
  createdAt: Timestamp;
}
