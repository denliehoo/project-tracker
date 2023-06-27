// import classes from "./Sidebar.module.css";
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Sidebar = (props) => {
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
    </div>
  )
}

export default Sidebar
