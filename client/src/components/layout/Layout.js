// import classes from "./Layout.module.css";

import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const Layout = (props) => {
  const { pathname } = useLocation()
  const [isLoading, setIsLoading] = useState(true)
  const [ownProjects, setOwnProjects] = useState([])
  const [sharedProject, setSharedProjects] = useState([])
  const [callApi, setCallApi] = useState(true)
  const apiUrl = process.env.REACT_APP_API_URL
  console.log(apiUrl)

  useEffect(() => {
    const getProjects = async () => {
      console.log('api called')
      try {
        const token = localStorage.getItem('JWT')
        if (!token) throw new Error('JWT Token doesnt exist')
        const headers = {
          Authorization: token,
        }
        const res = await axios.get(`${apiUrl}/projects`, {
          headers,
        })
        setOwnProjects(res.data.owner)
        setSharedProjects(res.data.editor)
        setIsLoading(false)
        setCallApi(false)
      } catch (err) {
        console.log(err)
      }
    }
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
        <div>
          {pathname !== '/login' && <Navbar />}
          {pathname !== '/login' && (
            <Sidebar sharedProject={sharedProject} ownProjects={ownProjects} />
          )}
          <main>{props.children}</main>
        </div>
      )}
    </div>
  )
}

export default Layout
