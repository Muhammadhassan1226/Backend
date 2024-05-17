import express, { Request, NextFunction, Response } from "express";
import globalErrorhandler from "./middleware/globalError";
import UserRouter from "./user/userRouter";
import { bookRouter } from "./Book/bookRouter";
import { upload } from "./Book/bookMiddleware";
const app = express();

app.use(express.json());

// routes

app.get("/", (req, res, next) => {
  res.json({ message: "Home Page Route" });
});

// global error function
app.use(globalErrorhandler);

//  user routes

app.use("/api/user", UserRouter);

// Books routes

app.use(
  "/api/book",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  bookRouter
);
export default app;
