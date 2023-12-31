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
import { validateForm } from '../../utils/validateForm'
import CustomFormFields from '../UI/CustomFormFields'

const Sidebar = (props) => {
  const [isAddProject, setIsAddProject] = useState(false)
  const [addProjectDetails, setAddProjectDetails] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [validationErrors, setValidationErrors] = useState({})
  const [showGoPremium, setShowGoPremium] = useState(false)
  const fieldsTypes = {
    name: 'text',
    description: 'text',
  }
  const isPremium = props.userDetails.isPremium

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

  const handleAddProject = () => {
    if (!validateForm(addProjectDetails, fieldsTypes, setValidationErrors))
      return
    if (props.ownProjects?.length > 0 && !isPremium) {
      setShowGoPremium(true)
      return
    }

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
  const onCloseModal = () => {
    setIsAddProject(false)
    setValidationErrors({})
    setAddProjectDetails({})
    setShowGoPremium(false)
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
        onClose={onCloseModal}
        title="Add Project"
        onConfirm={handleAddProject}
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <Box>
            <CustomFormFields
              detailsToSubmit={addProjectDetails}
              setDetailsToSubmit={setAddProjectDetails}
              validationErrors={validationErrors}
              setValidationErrors={setValidationErrors}
              fieldsTypes={fieldsTypes}
            />
            {showGoPremium && (
              <Box sx={{ marginTop: '10px' }}>
                <Typography>Free users can only own 1 Project</Typography>
                <Button
                  variant="outlined"
                  fullWidth
                  onClick={() => {
                    navigate('/billing')
                    onCloseModal()
                  }}
                >
                  Go Premium
                </Button>
              </Box>
            )}
          </Box>
        )}
      </CustomModal>
    </Box>
  )
}

export default Sidebar
