import Issue from "../models/Issue.js";
import Notification from "../models/Notification.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

export const createIssue = asyncHandler(async (req, res) => {
  const { title, description, category, lat, lng, address } = req.body;

  if (!title || !description || !category || lat === undefined || lng === undefined) {
    throw new ApiError(
      400,
      "title, description, category, lat and lng are required."
    );
  }

  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  if (Number.isNaN(parsedLat) || Number.isNaN(parsedLng)) {
    throw new ApiError(400, "lat and lng must be valid numbers.");
  }

  const images = [];
  const files = req.files || [];

  // Upload all issue images to Cloudinary and preserve order.
  for (const file of files) {
    const uploaded = await uploadBufferToCloudinary(
      file.buffer,
      "civic-app/issues",
      file.mimetype
    );
    images.push({ url: uploaded.secure_url, public_id: uploaded.public_id });
  }

  const issue = await Issue.create({
    title,
    description,
    category,
    images,
    location: {
      type: "Point",
      coordinates: [parsedLng, parsedLat]
    },
    address: address || "",
    userId: req.user._id
  });

  return apiResponse({
    res,
    statusCode: 201,
    message: "Issue reported successfully.",
    data: issue
  });
});

export const getAllIssues = asyncHandler(async (_req, res) => {
  const issues = await Issue.find()
    .populate("userId", "name email avatar")
    .sort({ createdAt: -1 });

  return apiResponse({
    res,
    message: "Issues fetched successfully.",
    data: issues
  });
});

export const getIssueById = asyncHandler(async (req, res) => {
  const issue = await Issue.findById(req.params.id).populate(
    "userId",
    "name email avatar"
  );
  if (!issue) {
    throw new ApiError(404, "Issue not found.");
  }

  return apiResponse({
    res,
    message: "Issue fetched successfully.",
    data: issue
  });
});

export const getMyIssues = asyncHandler(async (req, res) => {
  const issues = await Issue.find({ userId: req.user._id }).sort({ createdAt: -1 });

  return apiResponse({
    res,
    message: "User issues fetched successfully.",
    data: issues
  });
});

export const getNearbyIssues = asyncHandler(async (req, res) => {
  const { lat, lng, radius = 5 } = req.query;

  if (lat === undefined || lng === undefined) {
    throw new ApiError(400, "lat and lng query params are required.");
  }

  const parsedLat = Number(lat);
  const parsedLng = Number(lng);
  const parsedRadius = Number(radius);
  if (
    Number.isNaN(parsedLat) ||
    Number.isNaN(parsedLng) ||
    Number.isNaN(parsedRadius)
  ) {
    throw new ApiError(400, "lat, lng and radius must be valid numbers.");
  }

  // MongoDB expects maxDistance in meters.
  const issues = await Issue.find({
    location: {
      $near: {
        $geometry: {
          type: "Point",
          coordinates: [parsedLng, parsedLat]
        },
        $maxDistance: parsedRadius * 1000
      }
    }
  })
    .populate("userId", "name email avatar")
    .limit(100);

  return apiResponse({
    res,
    message: "Nearby issues fetched successfully.",
    data: issues
  });
});

export const updateIssueStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;
  const allowedStatuses = ["pending", "in-progress", "resolved"];

  if (!allowedStatuses.includes(status)) {
    throw new ApiError(400, "Invalid status value.");
  }

  const issue = await Issue.findById(req.params.id);
  if (!issue) {
    throw new ApiError(404, "Issue not found.");
  }

  issue.status = status;
  await issue.save();

  await Notification.create({
    userId: issue.userId,
    message: `Your issue "${issue.title}" status is now "${status}".`
  });

  return apiResponse({
    res,
    message: "Issue status updated successfully.",
    data: issue
  });
});
