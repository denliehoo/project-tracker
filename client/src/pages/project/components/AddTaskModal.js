// import classes from "./AddTaskModal.module.css";
import { apiCallAuth } from '../../../api/apiRequest'
import CustomModal from '../../../components/UI/CustomModal'
import { useState } from 'react'

const AddTaskModal = (props) => {
  const [addTaskDetails, setAddTaskDetails] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { token, apiUrl, projectId, resetState, getTasks } = props

  return (
    <CustomModal
      open={props.open}
      onClose={props.onClose}
      isLoading={isLoading}
    >
      <h3>Add Task </h3>
      <div>
        <label>
          Item:
          <input
            type="text"
            value={addTaskDetails.item || ''}
            onChange={(event) => {
              setAddTaskDetails({
                ...addTaskDetails,
                item: event.target.value,
              })
            }}
          />
        </label>

        <label>
          Next Action:
          <input
            type="text"
            value={addTaskDetails.nextAction || ''}
            onChange={(event) => {
              setAddTaskDetails({
                ...addTaskDetails,
                nextAction: event.target.value,
              })
            }}
          />
        </label>

        <label>
          Priority:
          <input
            type="number"
            value={addTaskDetails.priority || ''}
            onChange={(event) => {
              setAddTaskDetails({
                ...addTaskDetails,
                priority: event.target.value,
              })
            }}
          />
        </label>

        <div>
          <button
            onClick={() => {
              setIsLoading(true)
              const addTask = async () => {
                try {
                  const res = await apiCallAuth('post', '/tasks', {
                    ...addTaskDetails,
                    project: projectId,
                  })
                  console.log(res)

                  setIsLoading(false)
                  setAddTaskDetails(false)
                  resetState()

                  await getTasks()
                } catch (err) {
                  setIsLoading(false)
                  console.log(err)
                }
              }
              addTask()
            }}
          >
            Confirm Add Task
          </button>
        </div>
      </div>
    </CustomModal>
  )
}

export default AddTaskModal
