// import classes from "./Layout.module.css";

import { useEffect, useState } from 'react'
import Navbar from './Navbar'
import Sidebar from './Sidebar'
import { useLocation } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { addUserDetails } from '../../slices/userDetailsSlice'
import { apiCallAuth } from '../../api/apiRequest'

const layoutStyle = {
  display: 'flex',
  flexDirection: 'column', // horizontal layout
  height: '100vh', // occupy the full viewport height
}

const mainContainerStyle = {
  display: 'flex',
  flex: '1', // occupy remaining vertical space
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

  const getProjects = async () => {
    try {
      setIsLoading(true)
      const projectRes = await apiCallAuth('get', `/projects`)

      const userRes = await apiCallAuth('post', '/users/getUserByEmail', {
        email: projectRes.data.email,
      })
      // need call the getuserbyemail and put in plan... checkoutsess
      const { owner, editor, email, isPremium } = projectRes.data
      const { plan, endDate, stripeId, stripeCheckoutSession } = userRes.data
      setOwnProjects(owner)
      setSharedProjects(editor)
      dispatch(
        addUserDetails({
          email: email,
          owner: owner,
          editor: editor,
          isPremium: isPremium,
          plan: plan,
          endDate: endDate,
          stripeId: stripeId,
          stripeCheckoutSession: stripeCheckoutSession,
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
