import mongoose from "mongoose";

const pixelSchema = new mongoose.Schema(
  {
    pixelId: {
      type: String,
      required: true,
      trim: true,
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

const Pixel =
  mongoose.models.Pixel ||
  mongoose.model("Pixel", pixelSchema);

export default Pixel;