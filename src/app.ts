import express, { Request, NextFunction, Response } from "express";
import globalErrorhandler from "./middleware/globalError";

const app = express();

// routes

app.get("/", (req, res, next) => {
  res.json({ message: "Home Page Route" });
});

// global error function
app.use(globalErrorhandler);

export default app;
