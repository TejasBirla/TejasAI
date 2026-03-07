import Project from "../models/projectModel.js";

export const getAllprojects = async (req, res) => {
  try {
    const allprojects = await Project.find().sort({ createdAt: -1 });
    return res.status(200).json({
      success: true,
      message: "All projects are fetched.",
      allprojects,
    });
  } catch (error) {
    console.log("Error in fetching all projects: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const addProjectDetails = async (req, res) => {
  try {
    const { title, description, techStack, features, liveDemo, repoLink } =
      req.body;

    if (
      !title ||
      !description ||
      !Array.isArray(techStack) ||
      techStack.length === 0 ||
      !repoLink
    ) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing or invalid.",
      });
    }

    const newProject = await Project.create({
      title,
      description,
      techStack,
      features,
      liveDemo,
      repoLink,
    });

    res.status(201).json({
      success: true,
      message: "Project added successfully.",
      data: newProject,
    });
  } catch (error) {
    console.log("Error in adding project detail: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const updateProjectDetails = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, message: "Project ID is required." });
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(400)
        .json({ success: false, message: "Project not found." });
    }

    const { title, description, techStack, features, liveDemo, repoLink } =
      req.body;

    if (title) project.title = title;
    if (description) project.description = description;
    if (Array.isArray(techStack) && techStack.length > 0)
      project.techStack = techStack;
    if (Array.isArray(features)) project.features = features;
    if (liveDemo) project.liveDemo = liveDemo;
    if (repoLink) project.repoLink = repoLink;

    const updatedProject = await project.save();

    res.status(200).json({
      success: true,
      message: "Project updated successfully.",
      data: updatedProject,
    });
  } catch (error) {
    console.log("Error in updating project: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};

export const deleteProject = async (req, res) => {
  try {
    const projectId = req.params.id;
    if (!projectId) {
      return res
        .status(400)
        .json({ success: false, message: "Project ID is required." });
    }
    const project = await Project.findById(projectId);
    if (!project) {
      return res
        .status(400)
        .json({ success: false, message: "Project not found." });
    }
    await Project.findByIdAndDelete(projectId);
    res
      .status(200)
      .json({ success: true, message: "Project deleted successfully." });
  } catch (error) {
    console.log("Error in deleting project: ", error);
    res.status(500).json({
      success: false,
      message: "Internal server error.",
    });
  }
};
