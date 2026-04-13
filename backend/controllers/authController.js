import User from "../models/User.js";
import { ApiError } from "../utils/apiError.js";
import { apiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { generateToken } from "../utils/generateToken.js";
import { uploadBufferToCloudinary } from "../utils/uploadToCloudinary.js";

export const register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    throw new ApiError(400, "name, email and password are required.");
  }

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    throw new ApiError(409, "Email is already registered.");
  }

  let avatar = "";
  if (req.file) {
    const uploaded = await uploadBufferToCloudinary(
      req.file.buffer,
      "civic-app/avatars",
      req.file.mimetype
    );
    avatar = uploaded.secure_url;
  }

  const user = await User.create({
    name,
    email,
    password,
    avatar
  });

  const token = generateToken(user._id);

  return apiResponse({
    res,
    statusCode: 201,
    message: "User registered successfully.",
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    }
  });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ApiError(400, "email and password are required.");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw new ApiError(401, "Invalid credentials.");
  }

  const token = generateToken(user._id);

  return apiResponse({
    res,
    statusCode: 200,
    message: "Login successful.",
    data: {
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        createdAt: user.createdAt
      }
    }
  });
});
