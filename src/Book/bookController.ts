import { NextFunction, Response, Request } from "express";

const CreateBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);

  res.json({ message: "Book Created" });
};

export { CreateBook };
