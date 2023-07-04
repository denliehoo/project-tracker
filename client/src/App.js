import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Login from './pages/login/Login'
import Dashboard from './pages/dashboard/Dashboard'
import Layout from './components/layout/Layout'
import Billing from './pages/billing/Billing'
import Project from './pages/project/Project'

function App() {
  return (
    <Layout>
      <Routes>
        <Route exact path="/login" element={<Login />} />
        <Route exact path="/dashboard" element={<Dashboard />} />
        <Route exact path="/billing" element={<Billing />} />
        <Route exact path="/project/:projectId" element={<Project />} />
        <Route exact path="/" element={<Dashboard />} />
      </Routes>
    </Layout>
  )
}

export default App
