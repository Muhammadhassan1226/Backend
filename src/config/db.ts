import mongoose from "mongoose";
import { config } from "./config";

const ConncectDB = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connected to database");
    });

    mongoose.connection.on("error", (err) => {
      console.log(err.message);
    });
    await mongoose.connect(config.dburl as string);
  } catch (error: string | any) {
    console.log(error.message);
    process.exit(1);
  }
};

export default ConncectDB;
