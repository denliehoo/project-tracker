// import classes from "./Sidebar.module.css";
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiCallAuth } from '../../api/apiRequest'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CustomModal from '../UI/CustomModal'

const Sidebar = (props) => {
  const [isAddProject, setIsAddProject] = useState(false)
  const [addProjectDetails, setAddProjectDetails] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const sidebarStyle = {
    width: '15%', // adjust the width as per your needs
    background: '#f2f2f2', // sidebar background color
    padding: '10px',
    display: 'flex', // Use flexbox to arrange content
    flexDirection: 'column', // Stack items vertically
    justifyContent: 'space-between', // Distribute items evenly with space in between
  }

  const navigate = useNavigate()
  const ProjectItem = (p, index) => (
    <div key={index} style={{ cursor: 'pointer' }}>
      {/* Render dynamic components based on data */}
      <p
        onClick={() => {
          navigate(`/project/${p._id.toString()}`)
        }}
      >
        {p.name}
      </p>
    </div>
  )

  return (
    <div style={sidebarStyle}>
      <div>
        <Typography variant="h6">Own Projects</Typography>
        <div>
          {props.ownProjects.length
            ? props.ownProjects.map((p, index) => ProjectItem(p, index))
            : 'No owned projects'}
        </div>
        <Typography variant="h6">Shared Projects</Typography>
        <div>
          {props.sharedProject.length
            ? props.sharedProject.map((p, index) => ProjectItem(p, index))
            : 'No projects shared with you'}
        </div>
      </div>
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
      >
        {isLoading ? (
          <div>Loading...</div>
        ) : (
          <div>
            <Typography variant="h5">Add Project</Typography>
            <div>
              <label>
                Name:
                <input
                  type="text"
                  value={addProjectDetails.name || ''}
                  onChange={(event) => {
                    setAddProjectDetails({
                      ...addProjectDetails,
                      name: event.target.value,
                    })
                  }}
                />
              </label>
            </div>
            <div>
              <label>
                Description:
                <input
                  type="text"
                  value={addProjectDetails.description || ''}
                  onChange={(event) => {
                    setAddProjectDetails({
                      ...addProjectDetails,
                      description: event.target.value,
                    })
                  }}
                />
              </label>
            </div>
            <button
              onClick={() => {
                console.log(addProjectDetails)
                const addProject = async () => {
                  try {
                    const res = await apiCallAuth(
                      'post',
                      '/projects',
                      addProjectDetails,
                    )
                    console.log(res)
                    setIsLoading(false)
                    setIsAddProject(false)
                    props.refreshProjects()
                  } catch (err) {
                    console.log(err)
                  }
                }
                addProject()
              }}
            >
              Confirm Add Project
            </button>
          </div>
        )}
      </CustomModal>
    </div>
  )
}

export default Sidebar
