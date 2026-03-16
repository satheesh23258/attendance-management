import mongoose from 'mongoose';

const leaveSchema = new mongoose.Schema(
    {
        employeeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        employeeName: {
            type: String,
            required: true,
        },
        leaveType: {
            type: String,
            required: [true, 'Leave type is required'],
            enum: ['annual', 'sick', 'personal', 'permission', 'maternity', 'paternity', 'emergency', 'bereavement', 'compensatory', 'casual', 'vacation', 'other'],
        },
        startDate: {
            type: String, // Keep as string for better frontend compatibility or Date
            required: [true, 'Start date is required'],
        },
        endDate: {
            type: String,
            required: [true, 'End date is required'],
        },
        startTime: String,
        endTime: String,
        days: {
            type: Number,
            default: 1
        },
        emergencyContact: String,
        department: String,
        reason: {
            type: String,
            required: [true, 'Reason is required'],
            trim: true,
        },
        status: {
            type: String,
            enum: ['pending', 'approved', 'rejected', 'cancelled'],
            default: 'pending',
        },
        approvedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
        },
        approvedByName: {
            type: String,
        },
        rejectionReason: {
            type: String,
        },
    },
    {
        timestamps: true,
    }
);

const Leave = mongoose.model('Leave', leaveSchema);

export default Leave;
