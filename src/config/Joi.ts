import Joi, { SchemaMap } from "joi";

// Define the shape of the schema object
type UserSchema = {
  name: string;
  email: string;
  password: string;
};

// Create the Joi validation schema
const validationSchema: SchemaMap<UserSchema> = {
  name: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().required().min(6).max(15),
};

export default validationSchema;
