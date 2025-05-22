import mongoose from "mongoose";

const partnerCardSchema = new mongoose.Schema(
  {
    image: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const PartnerCard = mongoose.model("PartnerCard", partnerCardSchema);

export default PartnerCard;
