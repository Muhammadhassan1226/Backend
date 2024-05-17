import { config as conf } from "dotenv";

conf();

const _config = {
  port: process.env.PORT || 3000,
  dburl: process.env.MONGODB_URL,
  env: process.env.NODE_ENV,
  jwtToken: process.env.JWTTOKEN,
  cloud_name: process.env.cloud_name,
  api_key: process.env.api_key,
  api_secret: process.env.api_secret,
};

// to make them readonly

export const config = Object.freeze(_config);
