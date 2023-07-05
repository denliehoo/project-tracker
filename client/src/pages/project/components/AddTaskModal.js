// import classes from "./AddTaskModal.module.css";
import { apiCallAuth } from '../../../api/apiRequest'
import CustomModal from '../../../components/UI/CustomModal'
import { useState } from 'react'
import { validateForm } from '../../../utils/validateForm'
import CustomFormFields from '../../../components/UI/CustomFormFields'

const AddTaskModal = (props) => {
  const [addTaskDetails, setAddTaskDetails] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const fieldsTypes = {
    item: 'text',
    nextAction: 'text',
    priority: 'number',
  }

  const { projectId, resetState, getTasks } = props

  const handleAddTask = () => {
    if (!validateForm(addTaskDetails, fieldsTypes, setValidationErrors)) return

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
  }
  return (
    <CustomModal
      open={props.open}
      onClose={() => {
        props.onClose()
        setValidationErrors({})
        setAddTaskDetails({})
      }}
      isLoading={isLoading}
      title="Add Task"
      onConfirm={handleAddTask}
    >
      <CustomFormFields
        detailsToSubmit={addTaskDetails}
        setDetailsToSubmit={setAddTaskDetails}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        fieldsTypes={fieldsTypes}
      />
    </CustomModal>
  )
}

export default AddTaskModal
