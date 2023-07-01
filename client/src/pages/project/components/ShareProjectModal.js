// import classes from "./ShareProjectModal.module.css";
import { apiCallAuth } from '../../../api/apiRequest'
import CustomModal from '../../../components/UI/CustomModal'
import { useState } from 'react'

const ShareProjectModal = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [emails, setEmails] = useState('')
  const [emailToDelete, setEmailToDelete] = useState('')
  const [error, setError] = useState('')
  const {
    token,
    apiUrl,
    projectId,
    resetState,
    getTasks,
    projectDetails,
  } = props

  return (
    <CustomModal
      open={props.open}
      onClose={() => {
        props.onClose()
        setEmailToDelete('')
        setEmails('')
        setError('')
      }}
      isLoading={isLoading}
    >
      <h3>Sharing for {projectDetails.name}</h3>
      <h4>Sharing With:</h4>
      {projectDetails?.editors?.map((e) => (
        <div>
          <span
            onClick={() => {
              setEmailToDelete(e)
              console.log(`atempt to remove ${e}`)
            }}
          >
            x
          </span>{' '}
          {e}
        </div>
      ))}
      <div>
        <label>
          Email:
          <input
            type="text"
            value={emails || ''}
            onChange={(event) => {
              setEmails(event.target.value)
            }}
          />
        </label>

        <div>
          <button
            onClick={() => {
              setIsLoading(true)

              const shareProject = async () => {
                try {
                  const res = await apiCallAuth(
                    'put',
                    `/projects/${projectId}/sharing`,
                    { email: [emails] },
                  )
                  console.log(res)

                  setIsLoading(false)
                  //   resetState()

                  await getTasks()
                } catch (err) {
                  setIsLoading(false)
                  console.log(err)
                }
              }
              shareProject()
            }}
          >
            Confirm Share Project
          </button>
          {emailToDelete && (
            <button
              onClick={() => {
                setIsLoading(true)
                console.log(projectId)
                console.log(emailToDelete)

                const deleteShare = async () => {
                  try {
                    // it could be that if you want to use .delete and send data that it follows a slightly
                    // different pattern from the normal post and get etc
                    const res = await apiCallAuth(
                      'delete',
                      `/projects/${projectId}/sharing`,
                      {
                        email: [emailToDelete],
                      },
                    )
                    console.log(res)
                    setEmailToDelete('')
                    setIsLoading(false)
                    //   resetState()

                    await getTasks()
                  } catch (err) {
                    setIsLoading(false)
                    console.log(err)
                  }
                }
                deleteShare()
              }}
            >
              Confirm Delete
            </button>
          )}
          {error && <div>{error}</div>}
        </div>
      </div>
    </CustomModal>
  )
}

export default ShareProjectModal
