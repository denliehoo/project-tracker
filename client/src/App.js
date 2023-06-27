import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Layout from './components/layout/Layout'
import Settings from './pages/settings/Settings'
import Project from './pages/project/Project'

function App() {
  return (
    <Layout>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/settings" element={<Settings />} />
        <Route exact path="/project/:projectId" element={<Project />} />
      </Routes>
    </Layout>
  )
}

export default App
