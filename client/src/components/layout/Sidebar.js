// import classes from "./Sidebar.module.css";
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiCallAuth } from '../../api/apiRequest'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CustomModal from '../UI/CustomModal'
import {
  Box,
  Divider,
  Grid,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  TextField,
} from '@mui/material'

const Sidebar = (props) => {
  const [isAddProject, setIsAddProject] = useState(false)
  const [addProjectDetails, setAddProjectDetails] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const sidebarStyle = {
    width: '15%', // adjust the width as per your needs
    background: '#f2f2f2', // sidebar background color
    // backgroundColor: 'primary.main',
    padding: '10px',
    display: 'flex', // Use flexbox to arrange content
    flexDirection: 'column', // Stack items vertically
    justifyContent: 'space-between', // Distribute items evenly with space in between
  }

  const navigate = useNavigate()
  // const ProjectItem = (p, index) => (
  //   <div key={index} style={{ cursor: 'pointer' }}>
  //     {/* Render dynamic components based on data */}
  //     <p
  //       onClick={() => {
  //         navigate(`/project/${p._id.toString()}`)
  //       }}
  //     >
  //       {p.name}
  //     </p>
  //   </div>
  // )

  const handleAddProject = () => {
    console.log(addProjectDetails)
    const addProject = async () => {
      try {
        const res = await apiCallAuth('post', '/projects', addProjectDetails)
        console.log(res)
        setIsLoading(false)
        setIsAddProject(false)
        props.refreshProjects()
      } catch (err) {
        console.log(err)
      }
    }
    addProject()
  }

  const ProjectItem = (p, index) => (
    <ListItem disablePadding key={index}>
      {/* Render dynamic components based on data */}
      <ListItemButton
        onClick={() => {
          navigate(`/project/${p._id.toString()}`)
        }}
      >
        <ListItemText primary={p.name} />
      </ListItemButton>
    </ListItem>
  )
  return (
    <Box sx={sidebarStyle}>
      <List>
        <Typography variant="h6">Own Projects</Typography>
        {props.ownProjects.length ? (
          props.ownProjects.map((p, index) => ProjectItem(p, index))
        ) : (
          <Typography sx={{ padding: '5px' }}>No owned projects</Typography>
        )}
        <Divider />
        <Typography variant="h6">Shared Projects</Typography>
        {props.sharedProject.length ? (
          props.sharedProject.map((p, index) => ProjectItem(p, index))
        ) : (
          <Typography sx={{ padding: '5px' }}>
            No projects shared with you
          </Typography>
        )}
      </List>
      {/* Add Projects */}
      <div>
        <Button
          variant="outlined"
          fullWidth
          sx={{ color: 'primary.main' }}
          onClick={() => {
            console.log('attempt to add')
            setIsAddProject(true)
          }}
        >
          Add Project
        </Button>
      </div>
      {/* Add Project Modal (refactor in the future to a modal) */}
      <CustomModal
        open={isAddProject}
        onClose={() => {
          setIsAddProject(false)
        }}
        title="Add Project"
        onConfirm={handleAddProject}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="text"
                label="Name"
                variant="outlined"
                fullWidth
                value={addProjectDetails.name || ''}
                onChange={(event) => {
                  setAddProjectDetails({
                    ...addProjectDetails,
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
                value={addProjectDetails.description || ''}
                onChange={(event) => {
                  setAddProjectDetails({
                    ...addProjectDetails,
                    description: event.target.value,
                  })
                }}
              />
            </Grid>
          </Grid>
        )}
      </CustomModal>
    </Box>
  )
}

export default Sidebar
