// import { useNavigate } from 'react-router-dom'
// const Navbar = () => {
//   const navigate = useNavigate()
//   return (
//     <div>
//       <div
//         onClick={() => {
//           navigate('/dashboard')
//         }}
//       >
//         Logo
//       </div>
//       <div
//         onClick={() => {
//           navigate('/settings')
//         }}
//       >
//         Settings
//       </div>
//       <div>Profile</div>
//     </div>
//   )
// }

// export default Navbar

import { Box, Typography } from '@mui/material'
import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  const navbarStyle = {
    background: '#f2f2f2',
    // backgroundColor: 'primary.main',
    padding: '10px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }

  const logoStyle = {
    cursor: 'pointer',
    fontWeight: 'bold',
    fontSize: '20px',
  }

  const linkContainerStyle = {
    display: 'flex', // added display: 'flex'
    alignItems: 'center', // added alignItems: 'center'
  }

  const linkStyle = {
    cursor: 'pointer',
    marginLeft: '10px',
  }

  return (
    <Box sx={navbarStyle}>
      <div
        style={logoStyle}
        onClick={() => {
          navigate('/dashboard')
        }}
      >
        <Typography variant="h5">Project Tracker</Typography>
      </div>
      <div style={linkContainerStyle}>
        <div style={linkStyle}>
          <div
            onClick={() => {
              navigate('/billing')
            }}
          >
            Billing
          </div>
        </div>
        <div style={linkStyle}>
          <div
            onClick={() => {
              localStorage.removeItem('JWT')
              window.location.href = 'http://localhost:3000/login'
              // navigate('/login')
            }}
          >
            Logout
          </div>
        </div>
        <div style={linkStyle}>
          <div>Profile</div>
        </div>
      </div>
    </Box>
  )
}

export default Navbar
