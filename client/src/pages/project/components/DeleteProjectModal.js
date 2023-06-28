// import classes from "./DeleteProjectModal.module.css";
import CustomModal from '../../../components/UI/CustomModal'
import axios from 'axios'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const DeleteProjectModal = (props) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { token, apiUrl, projectId, resetState, getTasks, projectName } = props

  return (
    <CustomModal
      open={props.open}
      onClose={props.onClose}
      isLoading={isLoading}
    >
      Are you sure you want to delete the project: {projectName}?
      <button
        onClick={() => {
          console.log('deleted!!!!!!')
          const deleteProject = async () => {
            setIsLoading(true)
            try {
              if (!token) throw new Error('JWT Token doesnt exist')
              const headers = {
                Authorization: token,
              }
              const res = await axios.delete(
                `${apiUrl}/projects/${projectId}`,
                {
                  headers,
                },
              )
              console.log(res)

              setIsLoading(false)
              resetState()
              navigate('/dashboard')
              window.location.reload() // ****need to do a cleaner refresh maybe use redux to trigger a refresh

              await getTasks()
            } catch (err) {
              console.log(err)
            }
          }
          deleteProject()
        }}
      >
        Confirm Delete
      </button>
    </CustomModal>
  )
}

export default DeleteProjectModal
