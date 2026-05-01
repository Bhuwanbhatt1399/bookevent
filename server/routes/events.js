import express from "express";
import { protect, admin } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import {
    getAllEvent,
    getEventById,
    createEvent,
    updateEvent,
    deleteEvent
} from "../controllers/eventControllers.js";

const router = express.Router();

router.get("/", getAllEvent);
router.get("/:id", getEventById);
router.post("/", protect, admin, upload.single("image"), createEvent);
router.put("/:id", protect, admin, upload.single("image"), updateEvent);
router.delete("/:id", protect, admin, deleteEvent);

export default router;