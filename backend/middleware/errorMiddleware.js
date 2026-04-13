import { apiResponse } from "../utils/apiResponse.js";

export const notFound = (req, res, _next) => {
  return apiResponse({
    res,
    statusCode: 404,
    message: `Route not found: ${req.originalUrl}`
  });
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal server error";

  return apiResponse({
    res,
    statusCode,
    message,
    data: process.env.NODE_ENV === "production" ? null : { stack: err.stack }
  });
};
