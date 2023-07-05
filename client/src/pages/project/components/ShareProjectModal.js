// import classes from "./ShareProjectModal.module.css";
import { Button, Grid, TextField, Typography } from '@mui/material'
import { apiCallAuth } from '../../../api/apiRequest'
import CustomModal from '../../../components/UI/CustomModal'
import { useState } from 'react'

const ShareProjectModal = (props) => {
  const [isLoading, setIsLoading] = useState(false)
  const [emails, setEmails] = useState('')
  const [emailToDelete, setEmailToDelete] = useState('')
  const [error, setError] = useState('')
  const [emailValidationError, setEmailValidationError] = useState('')
  const { projectId, resetState, getTasks, projectDetails } = props

  const handleShareProject = () => {
    if (!emails || emails.trim() === '') {
      setEmailValidationError('Email To Share field cannot be empty')
      return
    }
    if (emails === projectDetails?.owner) {
      setEmailValidationError('You are the owner of the project')
      return
    }
    if (projectDetails?.editors?.includes(emails)) {
      setEmailValidationError(`You are already sharing with ${emails}`)
      return
    }

    setIsLoading(true)
    const shareProject = async () => {
      try {
        const res = await apiCallAuth('put', `/projects/${projectId}/sharing`, {
          email: [emails],
        })

        setIsLoading(false)
        if (res.data.doesntExist.length > 0) {
          setEmailValidationError(
            `${emails} isn't an existing user in Project Tracker`,
          )
        } else {
          await getTasks()
        }
      } catch (err) {
        setIsLoading(false)
        console.log(err)
      }
    }
    shareProject()
  }

  return (
    <CustomModal
      open={props.open}
      onClose={() => {
        props.onClose()
        setEmailToDelete('')
        setEmails('')
        setError('')
        setEmailValidationError('')
      }}
      isLoading={isLoading}
      title={`Sharing for ${projectDetails.name}`}
      confirmButtonText={'Confirm Share'}
      onConfirm={handleShareProject}
    >
      <div style={{ marginBottom: '10px' }}>
        <Typography variant="h6">Sharing With:</Typography>
      </div>
      {projectDetails?.editors?.map((e) => (
        <span
          style={{
            cursor: 'pointer',
            border: '1px solid black',
            padding: '5px',
            margin: '5px',
            boxShadow: emailToDelete === e ? '0 0 5px #003e87' : null,
          }}
          onClick={() => {
            // if already select, deselect it
            setEmailToDelete(emailToDelete === e ? '' : e)
          }}
        >
          x {e}
        </span>
      ))}
      <div>
        <Grid
          container
          spacing={2}
          style={{ marginTop: '10px', marginBottom: '10px' }}
        >
          <Grid item xs={12}>
            <TextField
              error={emailValidationError}
              helperText={emailValidationError}
              type="text"
              label="Email To Share"
              variant="outlined"
              fullWidth
              value={emails || ''}
              onChange={(event) => {
                setEmailValidationError('')
                setEmails(event.target.value)
              }}
            />
          </Grid>
        </Grid>

        <div>
          {emailToDelete && (
            <Button
              variant="outlined"
              fullWidth
              onClick={() => {
                setIsLoading(true)
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
              Remove {emailToDelete}
            </Button>
          )}
          {error && <div>{error}</div>}
        </div>
      </div>
    </CustomModal>
  )
}

export default ShareProjectModal
