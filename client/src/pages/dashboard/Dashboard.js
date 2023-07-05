import { useSelector } from 'react-redux'
import { Box, Typography } from '@mui/material'
import CenteredBoxInLayout from '../../components/UI/CenteredBoxInLayout'

const Dashboard = (props) => {
  const userDetails = useSelector((state) => state.userDetails)
  console.log(userDetails)
  return (
    <CenteredBoxInLayout>
      {/* Your component goes here */}

      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        Welcome back to Project Tracker
      </Typography>
      <Typography variant="h3" sx={{ textAlign: 'center' }}>
        {userDetails.name}
      </Typography>
    </CenteredBoxInLayout>
  )
}

export default Dashboard
