import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";

const CreateUser = (req: Request, res: Response, next: NextFunction) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    const error = createHttpError(400, "All Fields are required");
    return next(error);
  }

  res.json({ message: "User Created" });
};

export { CreateUser };
