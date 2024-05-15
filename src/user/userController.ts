import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";

const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
  // Validation
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are required");
    return next(error);
  }

  // check if user already exists

  const user = userModel.findOne({ email });
  if (user) {
    const error = createHttpError(400, "User Already Exists with this email");
    return next(error);
  }

  res.json({ message: "User Created" });
};

export { CreateUser };
