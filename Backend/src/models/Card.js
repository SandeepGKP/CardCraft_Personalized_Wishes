import mongoose from 'mongoose';

const cardSchema = new mongoose.Schema(
  {
    templateImageUrl: {
      type: String,
      required: true,
    },
    templateName: String,
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
