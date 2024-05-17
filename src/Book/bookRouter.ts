import express from "express";
import { CreateBook } from "./bookController";
const bookRouter = express.Router();

bookRouter.post("/", CreateBook);

export { bookRouter };
