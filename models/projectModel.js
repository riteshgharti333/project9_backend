import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
      maxlength: [50, "Project name must not exceed 50 characters"],
    },
     url: {
      type: String,
      required: [true, "Project url is required"],
      trim: true,
    },
    desc: {
      type: String,
      required: [true, "Project description is required"],
      trim: true,
      maxlength: [500, "Project description must not exceed 500 characters"],
    },
    image: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;
