import mongoose from 'mongoose';

const templateSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
      enum: ['Birthday', 'Anniversary', 'Festivals', 'Custom'],
    },
    imageUrl: {
      type: String, // Cloudinary URL
      required: true,
    },
    isPremium: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const Template = mongoose.model('Template', templateSchema);
export default Template;
