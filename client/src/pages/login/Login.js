import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(true)
  const navigate = useNavigate()
  const apiUrl = process.env.REACT_APP_API_URL
  console.log(apiUrl)

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

  // const handleGoogleLoginSuccess = (response) => {
  //   // Handle the successful response from Google OAuth (you can send it to the server if needed)
  //   console.log(response)
  // }

  // const handleGoogleLoginFailure = (error) => {
  //   // Handle the error or failure response from Google OAuth
  //   console.error(error)
  // }
  return (
    <div>
      <h2>{isLogin ? 'Login' : 'Register'}</h2>
      {error && <div>{error}</div>}
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Email:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={handleUsernameChange}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      {isLogin ? (
        <div>
          <button onClick={() => setIsLogin(false)}>Change To Register</button>
        </div>
      ) : (
        <div>
          <button onClick={() => setIsLogin(true)}>Change To Login</button>
        </div>
      )}
      <div>
        <button
          onClick={() => {
            window.location.href = 'http://localhost:3001/users/auth/google'
          }}
        >
          Log in with google
        </button>
      </div>
    </div>
  )
}

export default LoginForm
