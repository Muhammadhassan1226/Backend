import { NextFunction, Response, Request, raw } from "express";
import cloudinary from "../config/cloudinary";
import path from "node:path";
import fs from "node:fs";
import createHttpError from "http-errors";
import bookModel from "./bookModel";
import { create } from "node:domain";
interface AuthRequest extends Request {
  userId: String;
}

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
      coverImageId: Uploadresults.public_id,
      file: Bookfileupload.secure_url,
      fileId: Bookfileupload.public_id,
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

const Updatebook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, genre } = req.body;

    const BookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: BookId });

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // check if authorized

    const _req = req as AuthRequest;

    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "You can't update others Books"));
    }

    // check if Image is exists

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    let CoverImgName = "";
    let CoverImageId = "";
    if (files.coverImage) {
      const filename = files.coverImage[0].filename;
      const converMimeType = files.coverImage[0].mimetype.split("/").at(-1);
      // send files to cloudinary
      const filePath = path.resolve(
        __dirname,
        "../../public/data/uploads/",
        filename
      );
      CoverImgName = filename;

      const updatedResult = await cloudinary.uploader.upload(filePath, {
        filename_override: CoverImgName,
        format: converMimeType,
        folder: "books-pdfs",
      });

      // store secureurl in global variable

      CoverImgName = updatedResult.secure_url;
      CoverImageId = updatedResult.public_id;

      // delete after updation

      await fs.promises.unlink(filePath);
    }

    // check if file is Present

    let Filename = "";
    let FileId = "";
    const pdfName = files.file[0].filename;
    if (files.file) {
      const Bookfilepath = path.resolve(
        __dirname,
        "../../public/data/uploads",
        pdfName
      );

      // upload file on cloudinary

      const UpdatedFile = cloudinary.uploader.upload(Bookfilepath, {
        resource_type: "raw",
        filename_override: pdfName,
        folder: "books-file",
        format: "pdf",
      });

      Filename = (await UpdatedFile).secure_url;
      FileId = (await UpdatedFile).public_id;

      await fs.promises.unlink(Bookfilepath);
    }

    // Update in database

    const updatedbook = await bookModel.findByIdAndUpdate(
      {
        _id: BookId,
      },
      {
        title: title,
        genre: genre,
        coverImage: CoverImgName ? CoverImgName : book.coverImage,
        coverImageId: CoverImageId ? CoverImageId : book.coverImageId,
        file: Filename ? Filename : book.file,
        fileId: FileId ? FileId : book.fileId,
      },
      {
        new: true,
      }
    );

    console.log(updatedbook);

    await book.save();

    if (CoverImageId !== book.coverImageId) {
      await cloudinary.uploader.destroy(book.coverImageId);
    }

    if (FileId !== book.fileId) {
      await cloudinary.uploader.destroy(book.fileId, {
        resource_type: "raw",
      });
    }

    const updatedBook = await bookModel.findById({ _id: BookId });

    res.json(updatedBook);
  } catch (error: string | any) {
    const err = createHttpError(400, error.message);
    return next(err);
  }
};

const GetBooks = async (req: Request, res: Response, next: NextFunction) => {
  let books;
  try {
    books = await bookModel.find();
  } catch (error) {
    return next(createHttpError(500, "Error while Geting Books"));
  }
  res.json(books);
};

const GetSingleBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId });
    if (!book) {
      return next(createHttpError(404, "book not found"));
    }
    return res.json(book);
  } catch (error: string | any) {
    return next(createHttpError(500, error.message));
  }
};

const DeleteBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const bookId = req.params.bookId;

    const book = await bookModel.findOne({ _id: bookId });

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    // check access

    const _req = req as AuthRequest;

    if (book.author.toString() !== _req.userId) {
      return next(createHttpError(403, "You can't delete others Books"));
    }

    // Delete on cloudinary

    // books-file/w1vcfkvwrpfa60qyypkj.pdf
    //https://res.cloudinary.com/do0gesddm/raw/upload/v1715927147/books-file/w1vcfkvwrpfa60qyypkj.pdf

    // Getting Images public iD
    const coverImagesplit = book.coverImage.split("/");
    const coverPublicId =
      coverImagesplit.at(-2) + "/" + coverImagesplit.at(-1)?.split(".").at(-2);
    console.log(coverPublicId);

    // Getting files public iD

    const filesSplit = book.file.split("/");
    const FilePublicId = filesSplit.at(-2) + "/" + filesSplit.at(-1);

    console.log(FilePublicId);

    // delete from cloudinary
    // image deletion
    await cloudinary.uploader.destroy(coverPublicId);

    // File deletion

    await cloudinary.uploader.destroy(FilePublicId, {
      resource_type: "raw",
    });

    // delete record from database

    await bookModel.deleteOne({ _id: bookId });
    res.json({ coverPublicId, FilePublicId }).status(204);
  } catch (error: string | any) {
    const err = createHttpError(404, error.message);
    return next(err);
  }
};

export { CreateBook, Updatebook, GetBooks, GetSingleBook, DeleteBook };
