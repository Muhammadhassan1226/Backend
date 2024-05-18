import express, { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import { verify } from "jsonwebtoken";
import { config } from "../config/config";

interface AuthRequest extends Request {
  userId: String;
}

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("Authorization");

  if (!token) {
    return next(createHttpError(401, "Authorization token is required"));
  }

  const parsedToken = token.split(" ")[1];

  const decodedToken = verify(parsedToken, config.jwtToken as string);
  //   console.log(decodedToken);

  const _req = req as AuthRequest;

  _req.userId = decodedToken.sub as string;
  next();
};

export default authenticate;
