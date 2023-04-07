import type { Request, Response, NextFunction } from "express";

export const loggerMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(req.method, req.url);
  console.log(req.query);
  console.log(req.body);
  next();
};

// Define a type for your custom error object
interface CustomError extends Error {
  status: number;
}

class CustomError extends Error {
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

// Create a middleware function for 404 errors
export const notFoundMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Check if the response has been sent
  if (!res.headersSent) {
    // Create a custom error object with a 404 status
    const error: CustomError = new CustomError("Not Found", 404);
    error.status = 404;
    // Pass the error to the next function
    next(error);
  }
};

// Create another middleware function for error handling
export const errorMiddleware = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // Send a JSON response with the error message and status
  res.status(err.status || 500).json({
    message: err.message || "Internal Server Error",
  });
};
