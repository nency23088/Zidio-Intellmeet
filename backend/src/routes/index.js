import { Router } from "express";
import authRoutes from "./auth.routes.js";
import userRoutes from "./user.routes.js";
import meetingRoutes from "./meeting.routes.js";
import uploadRoutes from "./upload.routes.js";
import { authLimiter, apiLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.use("/auth", authLimiter, authRoutes);
router.use(apiLimiter);
router.use("/users", userRoutes);
router.use("/meetings", meetingRoutes);
router.use("/upload", uploadRoutes);

router.get("/health", (req, res) => {
  res.json({ ok: true, service: "intellmeet-api" });
});

export default router;
