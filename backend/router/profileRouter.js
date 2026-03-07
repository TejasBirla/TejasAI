import express from "express";
import {
  getDetails,
  addUserProfile,
  updateProfile,
} from "../controller/profileController.js";
import verifyAdmin from "../middleware/authMiddleware.js";

const profileRouter = express.Router();

profileRouter.get("/user-detail", verifyAdmin, getDetails);
profileRouter.post("/details", verifyAdmin, addUserProfile);
profileRouter.patch("/update-profile", verifyAdmin, updateProfile);

export default profileRouter;
