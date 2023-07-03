// import classes from "./UpdateProjectModal.module.css";
import { Grid, TextField } from '@mui/material'
import { apiCallAuth } from '../../../api/apiRequest'
import CustomModal from '../../../components/UI/CustomModal'
import { useState } from 'react'

const UpdateProjectModal = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    projectId,
    resetState,
    getTasks,
    projectDetails,
    updateProjectDetails,
    setUpdateProjectDetails,
  } = props
  const handleUpdateProject = () => {
    setIsLoading(true)
    console.log('*****')
    console.log({ ...updateProjectDetails })

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
      onClose={props.onClose}
      isLoading={isLoading}
      title="Update Project"
      onConfirm={handleUpdateProject}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            type="text"
            label="Name"
            variant="outlined"
            fullWidth
            value={updateProjectDetails.name || ''}
            onChange={(event) => {
              setUpdateProjectDetails({
                ...updateProjectDetails,
                name: event.target.value,
              })
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="text"
            label="Description"
            variant="outlined"
            fullWidth
            value={updateProjectDetails.description || ''}
            onChange={(event) => {
              setUpdateProjectDetails({
                ...updateProjectDetails,
                description: event.target.value,
              })
            }}
          />
        </Grid>
      </Grid>
    </CustomModal>
  )
}

export default UpdateProjectModal
