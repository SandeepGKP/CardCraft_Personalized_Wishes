import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      sparse: true, // Allow nulls for guest or google users if needed
    },
    password: {
      type: String,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    profilePicture: {
      type: String,
      default: '', // Will hold cloudinary URL
    },
    isGuest: {
      type: Boolean,
      default: false,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
    premiumPlan: {
      type: String,
      enum: ['none', 'monthly', 'yearly', 'lifetime'],
      default: 'none',
    },

  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', userSchema);
export default User;
