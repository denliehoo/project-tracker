import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import App from './App'
import reportWebVitals from './reportWebVitals'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider, createTheme } from '@mui/material'
import { Provider } from 'react-redux'
import { store } from './store'

const theme = createTheme({
  palette: {
    primary: {
      main: '#013e87',
    },
    secondary: {
      main: '#2e74c9',
    },
  },
  typography: {},
})

const root = ReactDOM.createRoot(document.getElementById('root'))
root.render(
  <Provider store={store}>
    <BrowserRouter>
      <React.StrictMode>
        <ThemeProvider theme={theme}>
          <App />
        </ThemeProvider>
      </React.StrictMode>
    </BrowserRouter>
  </Provider>,
)

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
