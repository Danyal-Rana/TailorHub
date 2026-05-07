const mongoose = require('mongoose');

const measurementSchema = mongoose.Schema(
    {
        customerId: {
            type: mongoose.Schema.Types.ObjectId,
            required: true,
            ref: 'Customer',
        },
        chest: {
            type: Number,
        },
        waist: {
            type: Number,
        },
        shoulder: {
            type: Number,
        },
        sleeves: {
            type: Number,
        },
        length: {
            type: Number,
        },
        notes: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model('Measurement', measurementSchema);
