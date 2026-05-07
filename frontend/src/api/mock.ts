// Mock Authentication Utility
// Used when the real backend database is unavailable

export const mockUser = {
    _id: "mock-user-id-123",
    name: "Demo User",
    email: "demo@example.com",
    role: "admin",
    token: "mock-jwt-token-xyz-123"
};

export const mockDelay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const mockLogin = async (email: string) => {
    await mockDelay(1500); // Simulate network delay
    return {
        ...mockUser,
        email: email,
        name: email.split('@')[0]
    };
};

export const mockRegister = async (name: string, email: string) => {
    await mockDelay(1500); // Simulate network delay
    return {
        ...mockUser,
        name: name,
        email: email
    };
};

// Mock data storage
let customers = [
    { _id: "cust_1", name: "Alice Johnson", phone: "+1 555-0123", email: "alice@example.com", address: "123 Maple Dr, NY" },
    { _id: "cust_2", name: "Bob Smith", phone: "+1 555-0198", email: "bob@test.com", address: "456 Oak Ln, CA" },
    { _id: "cust_3", name: "Charlie Davis", phone: "+1 555-0256", email: "charlie@demo.com", address: "789 Pine St, TX" }
];

export const mockGetCustomers = async () => {
    await mockDelay(600);
    return customers;
};

export const mockSearchCustomers = async (query: string) => {
    await mockDelay(400);
    const lowerQuery = query.toLowerCase();
    return customers.filter(c =>
        c.name.toLowerCase().includes(lowerQuery) ||
        c.phone.includes(query)
    );
};

export const mockAddCustomer = async (customer: any) => {
    await mockDelay(800);
    const newCustomer = { ...customer, _id: `cust_${Date.now()}` };
    customers = [newCustomer, ...customers];
    return newCustomer;
};

export const mockUpdateCustomer = async (id: string, updates: any) => {
    await mockDelay(600);
    customers = customers.map(c => c._id === id ? { ...c, ...updates } : c);
    return customers.find(c => c._id === id);
};

export const mockDeleteCustomer = async (id: string) => {
    await mockDelay(600);
    customers = customers.filter(c => c._id !== id);
    return { message: "Deleted successfully" };
};
// Mock Inventory Data
let inventory = [
    { _id: "inv_1", name: "Navy Blue Wool", category: "Fabric", stock: 45, unit: "meters", price: 25, supplier: "Textile World" },
    { _id: "inv_2", name: "Gold Buttons (Size 24)", category: "Button", stock: 150, unit: "pieces", price: 0.50, supplier: "Button Master" },
    { _id: "inv_3", name: "Black Silk Thread", category: "Thread", stock: 8, unit: "spools", price: 3.50, supplier: "Thread Co." },
    { _id: "inv_4", name: "YKK Invisible Zipper (Black)", category: "Zipper", stock: 12, unit: "pieces", price: 1.20, supplier: "Zipper King" }
];

export const mockGetInventory = async () => {
    await mockDelay(600);
    return inventory;
};

export const mockAddInventoryItem = async (item: any) => {
    await mockDelay(800);
    const newItem = { ...item, _id: `inv_${Date.now()}` };
    inventory = [newItem, ...inventory];
    return newItem;
};

export const mockUpdateInventoryItem = async (id: string, updates: any) => {
    await mockDelay(600);
    inventory = inventory.map(i => i._id === id ? { ...i, ...updates } : i);
    return inventory.find(i => i._id === id);
};

export const mockDeleteInventoryItem = async (id: string) => {
    await mockDelay(600);
    inventory = inventory.filter(i => i._id !== id);
    return { message: "Deleted successfully" };
};

// Mock Measurements
let measurements = [
    {
        _id: "meas_1",
        customerId: "cust_1",
        shoulder: 18,
        length: 30,
        bust: 36,
        underBust: 32,
        waist: 28,
        lowWaist: 30,
        hips: 38,
        sleeveLength: 22,
        armHole: 16,
        muscle: 12,
        elbow: 10,
        cuff: 8,
        chest: 38,
        notes: "Standard fit",
        createdAt: new Date().toISOString()
    },
    {
        _id: "meas_2",
        customerId: "cust_2",
        shoulder: 20,
        length: 32,
        bust: 40,
        underBust: 36,
        waist: 34,
        lowWaist: 36,
        hips: 42,
        sleeveLength: 24,
        armHole: 18,
        muscle: 14,
        elbow: 11,
        cuff: 9,
        chest: 42,
        notes: "Loose fit preferred",
        createdAt: new Date().toISOString()
    }
];

// Mock Orders
let orders: any[] = [
    {
        _id: "ord_1",
        customerId: "cust_1",
        customerName: "Alice Johnson",
        dressType: "Suit",
        status: "In Progress",
        price: 150,
        deliveryDate: new Date(Date.now() + 86400000 * 5).toISOString(),
        orderDate: new Date().toISOString()
    },
    {
        _id: "ord_2",
        customerId: "cust_2",
        customerName: "Bob Smith",
        dressType: "Shirt",
        status: "Completed",
        price: 45,
        deliveryDate: new Date(Date.now() - 86400000 * 2).toISOString(),
        orderDate: new Date(Date.now() - 86400000 * 10).toISOString()
    }
];

export const mockGetMeasurements = async (customerId?: string) => {
    await mockDelay(500);
    if (customerId) {
        return measurements.filter(m => m.customerId === customerId);
    }
    return measurements;
};

export const mockGetMeasurementById = async (id: string) => {
    await mockDelay(300);
    return measurements.find(m => m._id === id);
}

export const mockAddMeasurement = async (measurement: any) => {
    await mockDelay(600);
    const newMeas = { ...measurement, _id: `meas_${Date.now()}`, createdAt: new Date().toISOString() };
    measurements = [newMeas, ...measurements];
    return newMeas;
};

export const mockUpdateMeasurement = async (id: string, updates: any) => {
    await mockDelay(600);
    measurements = measurements.map(m => m._id === id ? { ...m, ...updates } : m);
    return measurements.find(m => m._id === id);
};

export const mockDeleteMeasurement = async (id: string) => {
    await mockDelay(600);
    measurements = measurements.filter(m => m._id !== id);
    return { message: "Measurement deleted successfully" };
};

export const mockGetOrders = async () => {
    await mockDelay(700);
    return orders;
};

export const mockCreateOrder = async (order: any) => {
    await mockDelay(1000);
    // Find customer name for display purposes
    const customers = await mockGetCustomers();
    const customer = customers.find((c: any) => c._id === order.customerId);

    const newOrder = {
        ...order,
        _id: `ord_${Date.now()}`,
        customerName: customer ? customer.name : "Unknown",
        status: order.status || "Pending",
        orderDate: new Date().toISOString()
    };
    orders = [newOrder, ...orders];
    return newOrder;
};

export const mockUpdateOrderStatus = async (id: string, status: string) => {
    await mockDelay(500);
    orders = orders.map(o => o._id === id ? { ...o, status } : o);
    return orders.find(o => o._id === id);
};

export const mockDeleteOrder = async (id: string) => {
    await mockDelay(600);
    orders = orders.filter(o => o._id !== id);
    return { message: "Order deleted" };
};
