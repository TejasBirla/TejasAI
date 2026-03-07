import Profile from "../models/profileModel.js";

export const getDetails = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found." });
    }
    res.status(200).json({ success: true, data: profile });
  } catch (error) {
    console.log("Error in getDetails controller: ", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const addUserProfile = async (req, res) => {
  try {
    const {
      fullName,
      title,
      bio,
      skills,
      openToWork,
      freelanceAvailable,
      contact,
      portfolio,
      hobbies,
      education,
    } = req.body;

    const existingProfile = await Profile.findOne();
    if (existingProfile) {
      return res.status(400).json({
        success: false,
        message: "Profile already exists.",
      });
    }

    if (
      !fullName ||
      !title ||
      !bio ||
      !Array.isArray(skills) ||
      skills.length === 0 ||
      !contact ||
      !contact.email ||
      !contact.linkedIn ||
      !contact.github ||
      !portfolio
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing or invalid.",
      });
    }

    const newProfile = await Profile.create({
      fullName,
      title,
      bio,
      skills,
      openToWork,
      freelanceAvailable,
      contact,
      portfolio,
      hobbies,
      education,
    });

    res.status(201).json({
      success: true,
      message: "Profile created successfully.",
      data: newProfile,
    });
  } catch (error) {
    console.log("Error in adding userProfile: ", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const profile = await Profile.findOne();
    if (!profile) {
      return res
        .status(404)
        .json({ success: false, message: "Profile not found." });
    }

    const {
      fullName,
      title,
      bio,
      skills,
      openToWork,
      freelanceAvailable,
      contact,
      portfolio,
      hobbies,
      education,
      experienceSummary,
    } = req.body;

    if (fullName) profile.fullName = fullName;
    if (title) profile.title = title;
    if (bio) profile.bio = bio;
    if (Array.isArray(skills)) profile.skills = skills;
    if (typeof openToWork === "boolean") profile.openToWork = openToWork;
    if (typeof freelanceAvailable === "boolean")
      profile.freelanceAvailable = freelanceAvailable;
    if (contact && typeof contact === "object") profile.contact = contact;
    if (portfolio) profile.portfolio = portfolio;
    if (Array.isArray(hobbies)) profile.hobbies = hobbies;
    if (Array.isArray(education)) profile.education = education;
    if (experienceSummary) profile.experienceSummary = experienceSummary;

    const updatedProfile = await profile.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully.",
      data: updatedProfile,
    });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ success: false, message: "Internal server error." });
  }
};
