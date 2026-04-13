import Notification from "../models/Notification.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ userId: req.user._id }).sort({
    createdAt: -1
  });

  return apiResponse({
    res,
    message: "Notifications fetched successfully.",
    data: notifications
  });
});

export const markNotificationAsRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findOne({
    _id: req.params.id,
    userId: req.user._id
  });

  if (!notification) {
    throw new ApiError(404, "Notification not found.");
  }

  notification.read = true;
  await notification.save();

  return apiResponse({
    res,
    message: "Notification marked as read.",
    data: notification
  });
});
