const mongoose = require('mongoose');

const complaintSchema = new mongoose.Schema(
    {
        item: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item',
            required: true
        },
        title: {
            type: String,
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        description: {
            type: String,
            required: true
        },
        createdOn: {
            type: Date,
            default: Date.now
        },
        status: {
            type: String,
            enum: ['unresolved', 'resolved', 'in_progress'],
            default: 'unresolved'
        }
    }
);

const Complaint = mongoose.model('Complaint', complaintSchema);

module.exports = Complaint;