import mongoose from "mongoose";

const profileSchema = new mongoose.Schema(
  {
    fullName: { type: String, required: true, trim: true },
    title: { type: String, required: true, trim: true },
    bio: { type: String, required: true, trim: true },
    skills: [{ type: String, required: true }],
    openToWork: { type: Boolean, default: true },
    freelanceAvailable: { type: Boolean, default: true },
    contact: {
      email: { type: String, required: true, trim: true },
      linkedIn: { type: String, required: true, trim: true },
      github: { type: String, required: true, trim: true },
      twitter: { type: String, trim: true },
    },
    portfolio: { type: String, required: true, trim: true },
    education: [
      {
        degree: { type: String, required: true },
        institute: { type: String, required: true },
        startYear: { type: String, required: true },
        yearOfPassing: { type: String },
        description: { type: String },
        grade: { type: String },
      },
    ],
    hobbies: { type: [String], default: [] },
    experienceSummary: {
      type: String,
      default:
        "I am a MERN stack developer with hands-on experience building real-world projects. While I have not held formal professional roles yet, my projects demonstrate my ability to design, develop, and deploy full-stack applications using modern technologies.",
    },
  },
  { timestamps: true },
);

const Profile = mongoose.model("Profile", profileSchema);

export default Profile;
