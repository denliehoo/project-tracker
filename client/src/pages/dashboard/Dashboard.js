import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'

const Dashboard = (props) => {
  const userDetails = useSelector((state) => state.userDetails)
  console.log(userDetails)
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="85vh"
    >
      {/* Your component goes here */}
      <div>
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          Welcome back to Project Tracker
        </Typography>
        <Typography variant="h3" sx={{ textAlign: 'center' }}>
          {userDetails.name}
        </Typography>
      </div>
    </Box>
  )
}

export default Dashboard
