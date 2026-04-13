export const loggerMiddleware = (req, _res, next) => {
  console.log(
    `[${new Date().toISOString()}] ${req.method} ${req.originalUrl} - IP: ${req.ip}`
  );
  next();
};
