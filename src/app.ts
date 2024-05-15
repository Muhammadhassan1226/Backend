import express, { Request, NextFunction, Response } from "express";
import globalErrorhandler from "./middleware/globalError";
import UserRouter from "./user/userRouter";

const app = express();

app.use(express.json());

// routes

app.get("/", (req, res, next) => {
  res.json({ message: "Home Page Route" });
});

// global error function
app.use(globalErrorhandler);

// register user routes

app.use("/api/user", UserRouter);
export default app;
