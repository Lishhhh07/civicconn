import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new ApiError(401, "Not authorized. Token missing.");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.userId).select("-password");
  if (!user) {
    throw new ApiError(401, "Not authorized. User not found.");
  }

  req.user = user;
  next();
});

export const authorizeAdmin = (req, _res, next) => {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail || req.user.email !== adminEmail) {
    throw new ApiError(403, "Forbidden. Admin access required.");
  }

  next();
};
