// import classes from "./DeleteTaskModal.module.css";
import { apiCallAuth } from '../../../api/apiRequest'
import CustomModal from '../../../components/UI/CustomModal'
import { useState } from 'react'

const DeleteTaskModal = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const { selectedRow, resetState, getTasks } = props

  return (
    <CustomModal
      open={props.open}
      onClose={props.onClose}
      isLoading={isLoading}
    >
      Are you sure you want to delete the task?
      <button
        onClick={() => {
          console.log('deleted!!!!!!')
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
        }}
      >
        Confirm Delete
      </button>
    </CustomModal>
  )
}

export default DeleteTaskModal
