// import classes from './Settings.module.css'
import { useSelector } from 'react-redux'
import axios from 'axios'
import { Box, Button, Typography } from '@mui/material'
const Billing = () => {
  const userDetails = useSelector((state) => state.userDetails)
  const apiUrl = process.env.REACT_APP_API_URL

  return (
    <div>
      {console.log(userDetails)}
      <Typography variant="h5">Billing</Typography>
      {userDetails.isPremium ? (
        <Box>
          <Typography>You are a premium user</Typography>
          <Typography>
            Your next payment is due on: {userDetails.endDate}
          </Typography>
        </Box>
      ) : (
        <Box>
          <Typography>Not a premium user</Typography>
          <Typography>
            Premium users can have as many projects as they want
          </Typography>
        </Box>
      )}
      {!userDetails.isPremium && (
        <Button
          variant="contained"
          onClick={() => {
            const checkOut = async () => {
              try {
                const token = localStorage.getItem('JWT')
                if (!token) throw new Error('JWT Token doesnt exist')

                const response = await axios.post(
                  `${apiUrl}/payments/stripe/create-checkout-session`,
                  {
                    items: [
                      {
                        id: 1,
                        quantity: 1,
                      },
                    ],
                  },
                  {
                    headers: {
                      'Content-Type': 'application/json',
                      Authorization: token,
                    },
                  },
                )

                if (response.status === 200) {
                  const { url } = response.data
                  window.location = url
                } else {
                  console.error('Unexpected response status:', response.status)
                }
              } catch (error) {
                console.error(error)
              }
            }
            checkOut()
          }}
        >
          go premium
        </Button>
      )}
      <div>
        {userDetails.stripeCheckoutSession && (
          <Button
            variant="contained"
            onClick={() => {
              const createPortalSession = async () => {
                try {
                  const token = localStorage.getItem('JWT')
                  if (!token) throw new Error('JWT Token doesnt exist')

                  const response = await axios.post(
                    `${apiUrl}/payments/stripe/create-portal-session`,
                    null,
                    {
                      headers: {
                        // 'Content-Type': 'application/json',
                        Authorization: token,
                      },
                    },
                  )

                  if (response.status === 200) {
                    const { url } = response.data
                    window.location = url
                  } else {
                    console.error(
                      'Unexpected response status:',
                      response.status,
                    )
                  }
                } catch (error) {
                  console.error(error)
                }
              }
              createPortalSession()
            }}
          >
            Manage Billing
          </Button>
        )}
      </div>
    </div>
  )
}

export default Billing
