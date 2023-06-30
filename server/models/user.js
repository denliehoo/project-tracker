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
      required: false,
    },
    isPremium: {
      type: Boolean,
      require: true,
      default: false,
    },
    plan: {
      type: String,
      enum: ['none', 'monthly', 'annual'],
      default: 'none',
    },
    endDate: {
      type: Date,
      default: null,
    },
    stripeId: {
      type: String,
      require: false, // change to true next time
      default: '',
    },
    stripeCheckoutSession: {
      type: String,
      require: false,
      default: '',
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
