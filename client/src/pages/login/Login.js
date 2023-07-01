import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { apiCallAuth } from '../../api/apiRequest'

function LoginForm() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const navigate = useNavigate()

  const handleUsernameChange = (event) => {
    setUsername(event.target.value)
    setError('')
  }

  const handlePasswordChange = (event) => {
    setPassword(event.target.value)
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    if (isLogin) {
      try {
        const res = await apiCallAuth('post', '/users/login', {
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
        setError(error.response.data.error)
      }
    } else {
      // register
      try {
        const res = await apiCallAuth('post', '/users/', {
          email: username,
          password: password,
        })
        // Handle the response data or perform further actions
        console.log('Response:', res)

        // Redirect to dashboard upon successful login
        // if (res.status === 200) {
        //   localStorage.setItem('JWT', res.data.token)
        //   navigate('/dashboard')
        // }
      } catch (error) {
        console.log(error)
        setError(error.response.data.error)
      }
    }
  }

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
    </div>
  )
}

export default LoginForm
