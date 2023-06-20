import mongoose from "mongoose";
import Project from "./project";
import User from "./user";

const connectDb = () => {
  return mongoose.connect(process.env.DATABASE_URL);
};

const models = { Project, User }; // import more models here in the future

export { connectDb };

export default models;
