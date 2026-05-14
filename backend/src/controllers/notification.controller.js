import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";
import Notification from "../models/Notification.js";

/** Maps DB field isRead to frontend `read` for IntellMeet UI types. */
function serializeNotification(n) {
  return {
    _id: n._id,
    message: n.message,
    read: n.isRead,
    createdAt: n.createdAt,
    type: n.type,
  };
}

export const listNotifications = asyncHandler(async (req, res) => {
  const rows = await Notification.find({ user: req.user._id }).sort({ createdAt: -1 }).limit(100);
  res.json({
    notifications: rows.map((r) => serializeNotification(r.toObject())),
  });
});

export const markNotificationRead = asyncHandler(async (req, res) => {
  const n = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!n) throw new AppError("Notification not found", 404);
  n.isRead = true;
  await n.save();
  res.json({ notification: serializeNotification(n.toObject()) });
});

export const markAllNotificationsRead = asyncHandler(async (req, res) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { $set: { isRead: true } });
  res.json({ message: "All notifications marked read" });
});
