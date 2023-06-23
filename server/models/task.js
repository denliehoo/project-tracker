import mongoose from "mongoose";
// import Project from "./project";

const taskSchema = new mongoose.Schema(
  {
    item: {
      type: String,
      required: true,
    },
    nextAction: {
      type: String,
      required: true,
    },
    priority: {
        type: Number,
        required: false
    },
    project:{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    }
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", taskSchema);
export default Task;
