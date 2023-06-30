// import classes from './Settings.module.css'
import { useSelector } from 'react-redux'
import axios from 'axios'
const Settings = () => {
  const userDetails = useSelector((state) => state.userDetails)
  const apiUrl = process.env.REACT_APP_API_URL

  return (
    <div>
      {console.log(userDetails)}
      <div>Settings</div>
      <div>Payments</div>
      {userDetails.isPremium ? (
        <div>You are a premium user</div>
      ) : (
        <div> Not a premium user</div>
      )}
      {!userDetails.isPremium && (
        <button
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
        </button>
      )}
      <div>
        {userDetails.stripeCheckoutSession && (
          <button
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
          </button>
        )}
      </div>
    </div>
  )
}

export default Settings
