import express, { NextFunction, Request, Response } from "express";
import { CreateUser, loginUser } from "./userController";

const UserRouter = express.Router();

// registration route

UserRouter.post("/register", CreateUser);

UserRouter.post("/login", loginUser);

export default UserRouter;
