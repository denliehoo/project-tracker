import mongoose from 'mongoose'

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
      required: false,
    },
    nextActionHistory: {
      type: [
        {
          time: {
            type: Date,
            required: false,
          },
          data: {
            type: String,
            required: false,
          },
        },
      ],
      required: false,
    },
    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project',
    },
    // customFields: {
    //   type: mongoose.Schema.Types.Mixed,
    // },
  },
  { timestamps: true },
)

const Task = mongoose.model('Task', taskSchema)
export default Task
/* e.g. for nextAction
nextAction = {
  data: 'Do 3',
  history: [
    { time: 'DATEANDTIMEOVERHERE', data: 'Do 1' },
    { time: 'DATEANDTIMEOVERHERE', data: 'Do 2' },
  ],
}
*/
