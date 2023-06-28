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

import React from 'react'
import { useNavigate } from 'react-router-dom'

const Navbar = () => {
  const navigate = useNavigate()

  const navbarStyle = {
    background: '#f2f2f2',
    borderBottom: '1px solid #ccc',
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
    textDecoration: 'underline',
  }

  return (
    <div style={navbarStyle}>
      <div
        style={logoStyle}
        onClick={() => {
          navigate('/dashboard')
        }}
      >
        Logo
      </div>
      <div style={linkContainerStyle}>
        <div style={linkStyle}>
          <div
            onClick={() => {
              navigate('/settings')
            }}
          >
            Settings
          </div>
        </div>
        <div style={linkStyle}>
          <div>Profile</div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
