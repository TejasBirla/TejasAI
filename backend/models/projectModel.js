import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true, trim: true },
    techStack: [{ type: String, required: true }],
    features: { type: [String], default: [] },
    liveDemo: { type: String, trim: true },
    repoLink: { type: String, required: true, trim: true },
  },
  { timestamps: true },
);

const Project = mongoose.model("Project", projectSchema);

export default Project;









