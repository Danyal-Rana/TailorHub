const Measurement = require('../models/Measurement');

// @desc    Get measurements by customer ID
// @route   GET /api/measurements/:customerId
// @access  Private
const getMeasurementsByCustomer = async (req, res) => {
    try {
        const measurements = await Measurement.find({ customerId: req.params.customerId }).sort({ createdAt: -1 });
        res.status(200).json(measurements);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Add new measurement
// @route   POST /api/measurements
// @access  Private
const addMeasurement = async (req, res) => {
    const { customerId, chest, waist, shoulder, sleeves, length, notes } = req.body;

    if (!customerId) {
        return res.status(400).json({ message: 'Please add customerId' });
    }

    try {
        const measurement = await Measurement.create({
            customerId,
            chest,
            waist,
            shoulder,
            sleeves,
            length,
            notes,
        });

        res.status(201).json(measurement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Update measurement
// @route   PUT /api/measurements/:id
// @access  Private
const updateMeasurement = async (req, res) => {
    try {
        const measurement = await Measurement.findById(req.params.id);

        if (!measurement) {
            return res.status(404).json({ message: 'Measurement not found' });
        }

        const updatedMeasurement = await Measurement.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
            }
        );

        res.status(200).json(updatedMeasurement);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc    Delete measurement
// @route   DELETE /api/measurements/:id
// @access  Private
const deleteMeasurement = async (req, res) => {
    try {
        const measurement = await Measurement.findById(req.params.id);

        if (!measurement) {
            return res.status(404).json({ message: 'Measurement not found' });
        }

        await measurement.deleteOne();

        res.status(200).json({ id: req.params.id });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    getMeasurementsByCustomer,
    addMeasurement,
    updateMeasurement,
    deleteMeasurement,
};
