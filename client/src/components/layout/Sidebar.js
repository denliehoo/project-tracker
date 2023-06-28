// import classes from "./Sidebar.module.css";
import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const Sidebar = (props) => {
  const [isAddProject, setIsAddProject] = useState(false)
  const [addProjectDetails, setAddProjectDetails] = useState({})
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
        <button
          onClick={() => {
            console.log('attempt to add')
            setIsAddProject(true)
          }}
        >
          Add Project
        </button>
      </div>
      {/* Add Project Modal (refactor in the future to a modal) */}
      {isAddProject && (
        <div>
          <div>Add proj details..</div>
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
          <button
            onClick={() => {
              console.log(addProjectDetails)
              const addProject = async () => {
                try {
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
    </div>
  )
}

export default Sidebar
