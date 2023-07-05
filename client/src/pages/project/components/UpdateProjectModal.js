// import classes from "./UpdateProjectModal.module.css";
import { apiCallAuth } from '../../../api/apiRequest'
import CustomModal from '../../../components/UI/CustomModal'
import { useState } from 'react'
import { validateForm } from '../../../utils/validateForm'
import CustomFormFields from '../../../components/UI/CustomFormFields'

const UpdateProjectModal = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    projectId,
    resetState,
    getTasks,
    // projectDetails,
    updateProjectDetails,
    setUpdateProjectDetails,
  } = props
  const [validationErrors, setValidationErrors] = useState({})
  const fieldsTypes = {
    name: 'text',
    description: 'text',
  }
  const handleUpdateProject = () => {
    if (!validateForm(updateProjectDetails, fieldsTypes, setValidationErrors))
      return

    setIsLoading(true)

    const updateProject = async () => {
      try {
        const res = await apiCallAuth('put', `/projects/${projectId}`, {
          ...updateProjectDetails,
        })
        console.log(res)

        setIsLoading(false)
        setUpdateProjectDetails(false)
        resetState()
        props.onClose()
        window.location.reload() // ****need to do a cleaner refresh maybe use redux to trigger a refresh

        await getTasks()
      } catch (err) {
        setIsLoading(false)
        console.log(err)
      }
    }
    updateProject()
  }

  return (
    <CustomModal
      open={props.open}
      onClose={() => {
        props.onClose()
        setValidationErrors({})
      }}
      isLoading={isLoading}
      title="Update Project"
      onConfirm={handleUpdateProject}
    >
      <CustomFormFields
        detailsToSubmit={updateProjectDetails}
        setDetailsToSubmit={setUpdateProjectDetails}
        validationErrors={validationErrors}
        setValidationErrors={setValidationErrors}
        fieldsTypes={fieldsTypes}
      />
    </CustomModal>
  )
}

export default UpdateProjectModal
