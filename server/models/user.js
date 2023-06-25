import mongoose from 'mongoose'

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    isPremium: {
      type: Boolean,
      require: true,
      default: false,
    },
    ownProjects: {
      type: [
        {
          _id: false,
          project: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Project',
          },
          locked: {
            type: Boolean,
          },
        },
      ],
      required: true,
    },
  },
  { timestamps: true },
)

const User = mongoose.model('User', userSchema)
export default User
