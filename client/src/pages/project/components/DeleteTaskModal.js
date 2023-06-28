// import classes from "./DeleteTaskModal.module.css";
import CustomModal from '../../../components/UI/CustomModal'
import axios from 'axios'
import { useState } from 'react'

const DeleteTaskModal = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const { token, apiUrl, selectedRow, resetState, getTasks } = props

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
              if (!token) throw new Error('JWT Token doesnt exist')
              const headers = {
                Authorization: token,
              }
              const res = await axios.delete(`${apiUrl}/tasks/${selectedRow}`, {
                headers,
              })
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
