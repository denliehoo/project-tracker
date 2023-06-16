import mongoose from "mongoose";
import Project from "./project";

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL);
};

const models = { Project }; // import more models here in the future

export { connectDb };

export default models;
