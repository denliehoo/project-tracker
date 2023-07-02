import React, { useState, useEffect } from 'react'
import { TextField, Button, Grid, Typography, Container } from '@mui/material'
import GoogleIcon from '@mui/icons-material/Google'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()
  const apiUrl = process.env.REACT_APP_API_URL

  const getParameterByName = (name) => {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.get(name)
  }

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    setError('')
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    setError('')
  }
  useEffect(() => {
    // Check if the token exists in the query parameters
    const token = getParameterByName('token')
    console.log(token)
    if (token) {
      // Store the token in local storage
      localStorage.setItem('JWT', token)
      // Redirect the user to the desired page (e.g., dashboard)
      navigate('/dashboard')
    }
  }, [])

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isLogin) {
      try {
        const res = await axios.post(`${apiUrl}/users/login`, {
          email: username,
          password: password,
        })
        // Handle the response data or perform further actions
        console.log('Response:', res)

        // Redirect to dashboard upon successful login
        if (res.status === 200) {
          localStorage.setItem('JWT', res.data.token)
          navigate('/dashboard')
        }
      } catch (error) {
        console.log(error)
        setError(error.response.data.error)
      }
    } else {
      // register and login
      try {
        let res = await axios.post(`${apiUrl}/users`, {
          email: username,
          password: password,
        })
        res = await axios.post(`${apiUrl}/users/login`, {
          email: username,
          password: password,
        })

        if (res.status === 200) {
          localStorage.setItem('JWT', res.data.token)
          navigate('/dashboard')
        }
      } catch (error) {
        console.log(error)
        setError(error.response.data.error)
      }
    }
  }

  return (
    <Container
      component="main"
      maxWidth="xs"
      style={{ height: '100vh', display: 'flex', alignItems: 'center' }}
    >
      <div
        style={{
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography variant="h4">Project Tracker</Typography>
        <Typography variant="h5">{isLogin ? 'Login' : 'Register'}</Typography>

        <form onSubmit={handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                type="username"
                label="Email"
                variant="outlined"
                fullWidth
                value={username}
                onChange={handleUsernameChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                type="password"
                label="Password"
                variant="outlined"
                fullWidth
                value={password}
                onChange={handlePasswordChange}
              />
            </Grid>
            {error && (
              <Grid item xs={12}>
                <Typography variant="v6">{error}</Typography>
              </Grid>
            )}

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                fullWidth
              >
                {isLogin ? 'Login' : 'Register'}
              </Button>
            </Grid>
          </Grid>
        </form>
        {/*  */}
        <div style={{ width: '100%' }}>
          <br />
          <Button
            variant="outlined"
            color="primary"
            fullWidth
            onClick={() => (isLogin ? setIsLogin(false) : setIsLogin(true))}
          >
            {isLogin ? 'Change To Register' : 'Change To Login'}
          </Button>
        </div>
        <br />
        <Button
          variant="outlined"
          color="secondary"
          fullWidth
          startIcon={<GoogleIcon />}
          onClick={() => {
            window.location.href = 'http://localhost:3001/users/auth/google'
          }}
        >
          Log in with google
        </Button>
      </div>
    </Container>
  )
}

export default LoginForm
