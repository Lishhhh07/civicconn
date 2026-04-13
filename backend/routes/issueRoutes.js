import express from "express";
import {
  createIssue,
  getAllIssues,
  getIssueById,
  getMyIssues,
  getNearbyIssues,
  updateIssueStatus
} from "../controllers/issueController.js";
import { authorizeAdmin, protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.array("images", 6), createIssue);
router.get("/", getAllIssues);
router.get("/user/me", protect, getMyIssues);
router.get("/nearby", getNearbyIssues);
router.get("/:id", getIssueById);
router.patch("/:id/status", protect, authorizeAdmin, updateIssueStatus);

export default router;
