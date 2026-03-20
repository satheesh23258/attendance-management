import mongoose from 'mongoose';

const locationHistorySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true // Frequently queried by userId
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: -1 // Frequently sorted by time descending
    }
  }
);

const LocationHistory = mongoose.model('LocationHistory', locationHistorySchema);
export default LocationHistory;
