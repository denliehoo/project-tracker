import { useNavigate } from 'react-router-dom'
const Navbar = () => {
  const navigate = useNavigate()
  return (
    <div>
      <div
        onClick={() => {
          navigate('/dashboard')
        }}
      >
        Logo
      </div>
      <div
        onClick={() => {
          navigate('/settings')
        }}
      >
        Settings
      </div>
      <div>Profile</div>
    </div>
  )
}

export default Navbar
