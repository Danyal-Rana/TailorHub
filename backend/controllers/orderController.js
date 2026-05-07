const Order = require('../models/Order');

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private
const getOrders = async (req, res) => {
    try {
        const orders = await Order.find()
            .populate('customerId', 'name phone')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Get orders by customer ID
// @route   GET /api/orders/customer/:customerId
// @access  Private
const getOrdersByCustomer = async (req, res) => {
    try {
        const orders = await Order.find({ customerId: req.params.customerId })
            .populate('customerId', 'name phone')
            .sort({ createdAt: -1 });
        res.status(200).json(orders);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res) => {
    const {
        customerId,
        measurementId,
        dressType,
        fabricDetails,
        price,
        status,
        pickupDate,
        deliveryDate,
    } = req.body;

    if (!customerId || !measurementId || !dressType || !price) {
        return res.status(400).json({ message: 'Please add all required fields' });
    }

    try {
        const order = await Order.create({
            customerId,
            measurementId,
            dressType,
            fabricDetails,
            price,
            status,
            pickupDate,
            deliveryDate,
        });

        res.status(201).json(order);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const Notification = require('../models/Notification'); // Import Notification model

// ... (existing code)

// @desc    Update order
// @route   PUT /api/orders/:id
// @access  Private
const updateOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        const { status } = req.body;

        // Check if status is changing
        if (status && status !== order.status) {
            // Create notification
            await Notification.create({
                userId: req.user.id, // Assuming the logged-in user (admin/tailor) triggers the update. 
                // In a real app, we might want to notify the *customer* (if they have a user account) or just the admin.
                // The prompt says "Get notifications for logged in user".
                // If the admin updates the order, the notification should probably go to the admin (as a log) OR the customer.
                // Given the prompt "Get notifications for logged in user", and "Create notification when order status changes",
                // let's assume valid scope. If the system had customer users, we'd notify `order.customerId`.
                // For now, I'll associate it with the current user or maybe I should just create it for the currentUser to see "Order Updated".
                // Let's create it for the current user for simplicity as per "Get notifications for logged in user" req.
                // Wait, if I am the admin and I update it, why do I need a notification?
                // Maybe the requirement implies that *other* users should see it?
                // Let's stick to the simplest interpretation: A notification is generated.
                // Ill assign it to the req.user.id (the one performing the action) effectively logging it, 
                // OR better, if I had a user ID for the customer.
                // The Customer model has no link to a User model (it's a standalone Customer record).
                // So I can't notify the "Customer" user.
                // So I will notify the Admin (req.user.id).

                orderId: order._id,
                message: `Order #${order._id} status updated to ${status}`,
            });
        }

        const updatedOrder = await Order.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json(updatedOrder);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete order
// @route   DELETE /api/orders/:id
// @access  Private
const deleteOrder = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);

        if (!order) {
            return res.status(404).json({ message: 'Order not found' });
        }

        await order.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getOrders,
    getOrdersByCustomer,
    createOrder,
    updateOrder,
    deleteOrder,
};
