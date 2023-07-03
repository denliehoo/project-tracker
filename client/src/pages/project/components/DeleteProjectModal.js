// import classes from "./DeleteProjectModal.module.css";
import CustomModal from '../../../components/UI/CustomModal'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiCallAuth } from '../../../api/apiRequest'

const DeleteProjectModal = (props) => {
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)
  const { projectId, resetState, getTasks, projectName } = props

  const handleDelete = () => {
    const deleteProject = async () => {
      setIsLoading(true)
      try {
        const res = await apiCallAuth('delete', `/projects/${projectId}`)
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
  }

  return (
    <CustomModal
      open={props.open}
      onClose={props.onClose}
      isLoading={isLoading}
      title="Delete Project"
      onConfirm={handleDelete}
    >
      Are you sure you want to delete '{projectName}' ?
    </CustomModal>
  )
}

export default DeleteProjectModal
