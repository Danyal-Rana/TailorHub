const mongoose = require('mongoose');

const orderSchema = mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Customer',
        },
        measurementId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Measurement',
        },
        dressType: {
            type: String,
            required: [true, 'Please add dress type'],
        },
        fabricDetails: {
            type: String,
        },
        price: {
            type: Number,
            required: [true, 'Please add price'],
        },
        status: {
            type: String,
            enum: ['Pending', 'In Progress', 'Ready', 'Delivered'],
            default: 'Pending',
        },
        pickupDate: {
            type: Date,
        },
        deliveryDate: {
            type: Date,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Order', orderSchema);
