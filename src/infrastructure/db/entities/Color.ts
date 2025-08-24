import mongoose from "mongoose";

const colorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  hexCode: {
    type: String,
    required: true,
    unique: true,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
}, {
  timestamps: true,
});

const Color = mongoose.model("Color", colorSchema);

export default Color;
