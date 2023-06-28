// import classes from "./UpdateProjectModal.module.css";
import CustomModal from '../../../components/UI/CustomModal'
import axios from 'axios'
import { useState } from 'react'

const UpdateProjectModal = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const {
    token,
    apiUrl,
    projectId,
    resetState,
    getTasks,
    projectDetails,
    updateProjectDetails,
    setUpdateProjectDetails,
  } = props

  return (
    <CustomModal
      open={props.open}
      onClose={props.onClose}
      isLoading={isLoading}
    >
      <h3>Update Project </h3>
      <div>
        <label>
          Name:
          <input
            type="text"
            value={updateProjectDetails.name || ''}
            onChange={(event) => {
              setUpdateProjectDetails({
                ...updateProjectDetails,
                name: event.target.value,
              })
            }}
          />
        </label>

        <label>
          Description:
          <input
            type="text"
            value={updateProjectDetails.description || ''}
            onChange={(event) => {
              setUpdateProjectDetails({
                ...updateProjectDetails,
                description: event.target.value,
              })
            }}
          />
        </label>

        <div>
          <button
            onClick={() => {
              setIsLoading(true)
              console.log('*****')
              console.log({ ...updateProjectDetails })

              const updateProject = async () => {
                try {
                  if (!token) throw new Error('JWT Token doesnt exist')
                  const headers = {
                    Authorization: token,
                  }

                  const res = await axios.put(
                    `${apiUrl}/projects/${projectId}`,
                    { ...updateProjectDetails },
                    {
                      headers,
                    },
                  )
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
            }}
          >
            Confirm Update Project
          </button>
        </div>
      </div>
    </CustomModal>
  )
}

export default UpdateProjectModal
