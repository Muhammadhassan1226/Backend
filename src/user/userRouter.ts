import express, { NextFunction, Request, Response } from "express";
import { CreateUser } from "./userController";

const UserRouter = express.Router();

// registration route

UserRouter.post("/register", CreateUser);

export default UserRouter;
