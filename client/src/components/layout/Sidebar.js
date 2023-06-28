// import classes from "./Sidebar.module.css";
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CustomModal from '../UI/CustomModal'

const Sidebar = (props) => {
  const [isAddProject, setIsAddProject] = useState(false)
  const [addProjectDetails, setAddProjectDetails] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const token = localStorage.getItem('JWT')
  const apiUrl = process.env.REACT_APP_API_URL

  const navigate = useNavigate()
  const ProjectItem = (p, index) => (
    <div key={index}>
      {/* Render dynamic components based on data */}
      <p
        onClick={() => {
          navigate(`/project/${p._id.toString()}`)
          console.log(p._id)
        }}
      >
        {p.name}
      </p>
    </div>
  )

  return (
    <div>
      <h2>Sidebar</h2>
      <div>
        <h2>Projects</h2>
        <h3>Own</h3>
        <div>{props.ownProjects.map((p, index) => ProjectItem(p, index))}</div>
        <h3>Shared</h3>
        <div>
          {props.sharedProject.map((p, index) => ProjectItem(p, index))}
        </div>
      </div>
      {/* Add Projects */}
      <div>
        <Button
          variant="outlined"
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
                    setIsLoading(true)
                    if (!token) throw new Error('JWT Token doesnt exist')
                    const headers = {
                      Authorization: token,
                    }
                    const res = await axios.post(
                      `${apiUrl}/projects`,
                      addProjectDetails,
                      {
                        headers,
                      },
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
