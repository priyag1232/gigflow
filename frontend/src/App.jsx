import React, { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Login from './pages/Login'
import Register from './pages/Register'
import GigFeed from './pages/GigFeed'
import PostGig from './pages/PostGig'
import GigDetails from './pages/GigDetails'
import DashboardClient from './pages/DashboardClient'
import DashboardFreelancer from './pages/DashboardFreelancer'
import { useDispatch } from 'react-redux'
import { loadUser } from './redux/slices/authSlice'

export default function App(){
  const dispatch = useDispatch()
  useEffect(()=>{ dispatch(loadUser()) }, [])

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<GigFeed/>} />
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>} />
        <Route path="/post" element={<PostGig/>} />
        <Route path="/gigs/:id" element={<GigDetails/>} />
        <Route path="/dashboard/client" element={<DashboardClient/>} />
        <Route path="/dashboard/freelancer" element={<DashboardFreelancer/>} />
      </Routes>
    </Layout>
  )
}
