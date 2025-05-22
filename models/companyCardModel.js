import mongoose from "mongoose";

const companyCardSchema = new mongoose.Schema(
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

const CompanyCard = mongoose.model("CompanyCard", companyCardSchema);

export default CompanyCard;
