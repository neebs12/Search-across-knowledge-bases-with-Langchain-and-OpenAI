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
