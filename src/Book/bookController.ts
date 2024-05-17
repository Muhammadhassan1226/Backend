import { NextFunction, Response, Request } from "express";

const CreateBook = async (req: Request, res: Response, next: NextFunction) => {
  res.json({ message: "Book Created" });
};

export { CreateBook };
