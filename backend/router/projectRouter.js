import express from "express";
import {
  getAllprojects,
  addProjectDetails,
  updateProjectDetails,
  deleteProject,
} from "../controller/projectController.js";
import verifyAdmin from "../middleware/authMiddleware.js";

const projectRouter = express.Router();

projectRouter.get("/all-project", verifyAdmin, getAllprojects);
projectRouter.post("/add-project", verifyAdmin, addProjectDetails);
projectRouter.patch("/update-project/:id", verifyAdmin, updateProjectDetails);
projectRouter.delete("/delete-project/:id", verifyAdmin, deleteProject);

export default projectRouter;
