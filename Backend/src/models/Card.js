import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    templateImageUrl: {
      type: String,
      required: true,
    },
    templateName: String,
    backgroundMode: { type: String, default: 'image' },
    backgroundColor: { type: String, default: '#6366f1' },
    outerBgColor: { type: String, default: '#0a0a0a' },
    cardSize: { type: Number, default: 440 },
    message: String,
    textStyle: {
      fontSize: Number,
      color: String,
      position: String,
      fontFamily: String,
    },
    decorations: {
      type: Array,
      default: []
    },
    senderName: String,
    senderProfilePic: String,
  },
  {
    timestamps: true,
  }
);

const Card = mongoose.model('Card', cardSchema);
export default Card;
