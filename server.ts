import app from "./src/app";
import { config } from "./src/config/config";
import ConncectDB from "./src/config/db";

const Startserver = async () => {
  await ConncectDB();
  const Port = config.port || 3000;

  app.listen(Port, () => {
    console.log(`Server is running on port ${Port}`);
  });
};

Startserver();
