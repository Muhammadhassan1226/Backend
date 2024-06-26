import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { config } from "../config/config";

const globalErrorhandler = (
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const statuscode = err.status || 500;
  res.status(statuscode).json({
    message: err.message,

    errorStack: config.env === "development" ? err.stack : "",
  });
};

export default globalErrorhandler;
