import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      maxlength: 100,
    },
    businessName: {
      type: String,
      trim: true,
      maxlength: 150,
      required: [true, "Business name is required"],
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please fill a valid email address",
      ],
    },
    phoneNumber: {
      type: String,
      required: [true, "Phone number is required"],
      trim: true,
      maxlength: 20,
    },
    projectType: {
      type: String,
      trim: true,
      maxlength: 100,
    },
    projectDescription: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
    budget: {
      type: String,
      trim: true,
      maxlength: 50,
    },
    heardAboutUs: {
      type: String,
      trim: true,
      maxlength: 200,
    },
  },
  {
    timestamps: true,
  }
);

const Contact = mongoose.model("Contact", contactSchema);

export default Contact;
