// import classes from "./AddTaskModal.module.css";
import { Button, Grid, TextField, Typography } from '@mui/material'
import { apiCallAuth } from '../../../api/apiRequest'
import CustomModal from '../../../components/UI/CustomModal'
import { useState } from 'react'

const AddTaskModal = (props) => {
  const [addTaskDetails, setAddTaskDetails] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const { projectId, resetState, getTasks } = props

  const handleAddTask = () => {
    setIsLoading(true)
    const addTask = async () => {
      try {
        const res = await apiCallAuth('post', '/tasks', {
          ...addTaskDetails,
          project: projectId,
        })
        console.log(res)

        setIsLoading(false)
        setAddTaskDetails(false)
        resetState()

        await getTasks()
      } catch (err) {
        setIsLoading(false)
        console.log(err)
      }
    }
    addTask()
  }

  return (
    <CustomModal
      open={props.open}
      onClose={props.onClose}
      isLoading={isLoading}
      title="Add Task"
      onConfirm={handleAddTask}
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <TextField
            type="text"
            label="Item"
            variant="outlined"
            fullWidth
            value={addTaskDetails.item || ''}
            onChange={(event) => {
              setAddTaskDetails({
                ...addTaskDetails,
                item: event.target.value,
              })
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="text"
            label="Next Action"
            variant="outlined"
            fullWidth
            value={addTaskDetails.nextAction || ''}
            onChange={(event) => {
              setAddTaskDetails({
                ...addTaskDetails,
                nextAction: event.target.value,
              })
            }}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            type="number"
            label="Priority"
            variant="outlined"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            fullWidth
            value={addTaskDetails.priority || ''}
            onChange={(event) => {
              setAddTaskDetails({
                ...addTaskDetails,
                priority: event.target.value,
              })
            }}
          />
        </Grid>
        {/* {error && (
          <Grid item xs={12}>
            <Typography variant="v6">{error}</Typography>
          </Grid>
        )} */}
      </Grid>
    </CustomModal>
  )
}

export default AddTaskModal
