import { NextFunction, Response, Request, raw } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";

const CreateBook = async (req: Request, res: Response, next: NextFunction) => {
  interface AuthRequest extends Request {
    userId: String;
  }

  let filePath: string;
  let Bookfilepath: string;
  console.log("files", req.files);

  const { title, genre } = req.body;

  if (typeof title !== "string") {
    const err = createHttpError(400, "Title must be Valid");
    return next(err);
  }
  if (typeof genre !== "string") {
    const err = createHttpError(400, "Genre must be Valid");
    return next(err);
  }

  // Image upload Logic

  // Stack Overflow

  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };

    // image/png =>  png
    const coverImagemimetype = files.coverImage[0].mimetype.split("/").at(-1);

    const fileName = files.coverImage[0].filename;

    filePath = path.resolve(__dirname, "../../public/data/uploads", fileName);

    const Uploadresults = await cloudinary.uploader.upload(filePath, {
      filename_override: fileName,
      folder: "books-cover",
      format: coverImagemimetype,
    });

    // Pdf upload

    const pdfName = files.file[0].filename;
    Bookfilepath = path.resolve(
      __dirname,
      "../../public/data/uploads",
      pdfName
    );

    const Bookfileupload = await cloudinary.uploader.upload(Bookfilepath, {
      resource_type: "raw",
      filename_override: pdfName,
      folder: "books-pdfs",
      format: "pdf",
    });

    const _req = req as AuthRequest;

    const createBook = await bookModel.create({
      title,
      genre,
      author: _req.userId,
      coverImage: Uploadresults.secure_url,
      file: Bookfileupload.secure_url,
    });

    // @ts-ignore
    console.log("id", req.userId);

    // Delete Temporary Files
    try {
      await fs.promises.unlink(filePath);
    } catch (error) {
      console.error(`Error deleting file: ${filePath}`, error);
    }

    try {
      if (fs.existsSync(Bookfilepath)) {
        await fs.promises.unlink(Bookfilepath);
      } else {
      }
    } catch (error) {
      console.error(`Error deleting file: ${Bookfilepath}`, error);
    }

    res.json({ id: createBook._id }).status(201);
  } catch (error: string | any) {
    const err = createHttpError(400, error.message);
    console.log(error);
    return next(err);
  }
};

export { CreateBook };
