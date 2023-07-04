// import classes from "./DeleteTaskModal.module.css";
import { apiCallAuth } from '../../../api/apiRequest'
import CustomModal from '../../../components/UI/CustomModal'
import { useState } from 'react'

const DeleteTaskModal = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const { selectedRow, resetState, getTasks } = props

  const handleDeleteTask = () => {
    const deleteTask = async () => {
      setIsLoading(true)
      try {
        const res = await apiCallAuth('delete', `/tasks/${selectedRow}`)
        console.log(res)
        setIsLoading(false)
        resetState()

        await getTasks()
      } catch (err) {
        console.log(err)
      }
    }
    deleteTask()
  }

  return (
    <CustomModal
      open={props.open}
      onClose={props.onClose}
      isLoading={isLoading}
      title="Delete Task"
      onConfirm={handleDeleteTask}
    >
      Are you sure you want to delete the task?
    </CustomModal>
  )
}

export default DeleteTaskModal
