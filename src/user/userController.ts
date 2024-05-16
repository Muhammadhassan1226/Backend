import { NextFunction, Response, Request } from "express";
import createHttpError from "http-errors";
import userModel from "./userModel";
import bcrypt from "bcrypt";
import { sign } from "jsonwebtoken";
import { config } from "../config/config";
import validationSchema from "../config/Joi";
import Joi from "joi";

const CreateUser = async (req: Request, res: Response, next: NextFunction) => {
  // Validation

  let name: string;
  let email: string;
  let password: string;

  try {
    let response = await Joi.object(validationSchema).validateAsync(req.body);
    console.log(response);

    ({ name, email, password } = response);

    // check if username exists before
    const username = await userModel.findOne({ name });

    if (username) {
      const error = createHttpError(
        400,
        "User with this username already exists"
      );
      return next(error);
    }

    // check if email exists before

    const Findemail = await userModel.findOne({ email });
    if (Findemail) {
      const error = createHttpError(400, "User with this email exists");
      return next(error);
    }

    // Password hash Logic

    const HashedPassword = await bcrypt.hash(password, 10);

    // User Creation

    const newUser = await userModel.create({
      name,
      email,
      password: HashedPassword,
    });

    // Token Generation

    const token = sign({ sub: newUser._id }, config.jwtToken as string, {
      expiresIn: "7d",
    });

    // Omit password field from user data
    const userData = newUser.toObject();
    delete (userData as any).password;

    // Response
    res.json({ accesstoken: token, user: userData }).status(200);
  } catch (error: string | any) {
    const err = createHttpError(400, error.message);
    return next(err);
  }
};

export { CreateUser };
