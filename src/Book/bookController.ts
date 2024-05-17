import { NextFunction, Response, Request, raw } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import createHttpError from "http-errors";

const CreateBook = async (req: Request, res: Response, next: NextFunction) => {
  console.log("files", req.files);

  // Image upload Logic

  // Stack Overflow

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  // image/png =>  png
  const coverImagemimetype = files.coverImage[0].mimetype.split("/").at(-1);

  const fileName = files.coverImage[0].filename;

  const filePath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  try {
    const Uploadresults = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "books-cover",
      format: coverImagemimetype,
    });

    console.log(Uploadresults);
  } catch (error: string | any) {
    console.log(error);
    const err = createHttpError(400, error.message);
    return next(err);
  }

  // Pdf upload

  const pdfName = files.file[0].filename;
  const Bookfilepath = path.resolve(
    __dirname,
    "../../public/data/uploads",
    fileName
  );

  try {
    const Bookfileupload = await cloudinary.uploader.upload(Bookfilepath, {
      resource_type: "raw",
      filename_override: pdfName,
      folder: "books-pdfs",
      format: "pdf",
    });

    console.log(Bookfileupload);
  } catch (error: string | any) {
    const err = createHttpError(400, error.message);
    console.log(error);
    return next(err);
  }

  res.json({ message: "Book Created" });
};

export { CreateBook };
