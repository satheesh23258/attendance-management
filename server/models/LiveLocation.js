import mongoose from 'mongoose';

const liveLocationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true // A user has only one current live location
    },
    lat: {
      type: Number,
      required: true
    },
    lng: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true // updatedAt will be automatically managed
  }
);

// Add 2dsphere index for geospatial querying if needed
liveLocationSchema.index({ lat: 1, lng: 1 });

const LiveLocation = mongoose.model('LiveLocation', liveLocationSchema);
export default LiveLocation;
