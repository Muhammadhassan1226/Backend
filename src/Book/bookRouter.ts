import express from "express";
import {
  CreateBook,
  Updatebook,
  GetBooks,
  GetSingleBook,
  DeleteBook,
} from "./bookController";
const bookRouter = express.Router();
import { upload } from "./bookMiddleware";
import authenticate from "../middleware/authenticate";

bookRouter.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  CreateBook
);

bookRouter.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  Updatebook
);

bookRouter.get("/", GetBooks);

bookRouter.get("/:bookId", GetSingleBook);

bookRouter.delete("/:bookId", authenticate, DeleteBook);
export { bookRouter };
