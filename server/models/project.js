import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    id: {
      type: String,
      required: false,
    },
    owner: {
      type: String,
      required: true,
    },
    editors: {
      type: [String],
      required: false,
    },
  },
  { timestamps: true },
)

const Project = mongoose.model('Project', projectSchema)
export default Project
