// import classes from "./Layout.module.css";

import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useLocation } from 'react-router-dom'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { addUserDetails } from '../../slices/userDetailsSlice'

const layoutStyle = {
  display: 'flex',
  flexDirection: 'column', // horizontal layout
  height: '100vh', // occupy the full viewport height
}

const mainContainerStyle = {
  display: 'flex',
  flex: '1', // occupy remaining vertical space
}

const sidebarStyle = {
  width: '20%', // adjust the width as per your needs
  background: '#f2f2f2', // sidebar background color
}

const mainStyle = {
  flex: '1', // occupy remaining space
  padding: '20px', // adjust the padding as per your needs
}

const Layout = (props) => {
  const { pathname } = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [ownProjects, setOwnProjects] = useState([])
  const [sharedProject, setSharedProjects] = useState([])
  const [callApi, setCallApi] = useState(true)
  const dispatch = useDispatch()
  const apiUrl = process.env.REACT_APP_API_URL

  const getProjects = async () => {
    console.log('api called')
    try {
      setIsLoading(true)
      const token = localStorage.getItem('JWT')
      if (!token) throw new Error('JWT Token doesnt exist')
      const headers = {
        Authorization: token,
      }
      let res = await axios.get(`${apiUrl}/projects`, {
        headers,
      })
      const { owner, editor, email, isPremium } = res.data
      setOwnProjects(owner)
      setSharedProjects(editor)
      dispatch(
        addUserDetails({
          email: email,
          owner: owner,
          editor: editor,
          isPremium: isPremium,
        }),
      )
      setIsLoading(false)
      setCallApi(false)
    } catch (err) {
      console.log(err)
    }
  }
  useEffect(() => {
    if (pathname !== '/login' && callApi) {
      getProjects()
    } else {
      setIsLoading(false)
    }
    console.log('rerendered')
  }, [pathname, callApi])
  return (
    <div>
      {isLoading ? (
        <div>Loading.....</div>
      ) : (
        <div style={layoutStyle}>
          {pathname !== '/login' && <Navbar />}
          <div style={mainContainerStyle}>
            {pathname !== '/login' && (
              <Sidebar
                sharedProject={sharedProject}
                ownProjects={ownProjects}
                refreshProjects={getProjects}
                style={sidebarStyle}
              />
            )}
            <main style={mainStyle}>{props.children}</main>
          </div>
        </div>
      )}
    </div>
  )
}

export default Layout
