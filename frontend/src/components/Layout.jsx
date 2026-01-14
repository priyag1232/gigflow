import React, { useState, useEffect, useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import ToastContainer from './ToastContainer'
import { io } from 'socket.io-client'
import { logout } from '../redux/slices/authSlice'

export default function Layout({ children }){
  const user = useSelector(state => state.auth.user)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const ref = useRef()

  const initials = (name = '') => {
    const parts = name.trim().split(/\s+/).filter(Boolean)
    if (parts.length === 0) return 'U'
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase()
    return (parts[0].charAt(0) + parts[parts.length-1].charAt(0)).toUpperCase()
  }

  const niceName = (name = '') => {
    return name.split(' ').map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' ')
  }

  useEffect(()=>{
    if (!user) return
    const socket = io(import.meta.env.VITE_API_URL || 'http://localhost:4000', { withCredentials: true, transports: ['websocket','polling'] })
    socket.on('connect', ()=>{})
    socket.on('notification', (data)=>{
      window.dispatchEvent(new CustomEvent('gigflow:toast', { detail: { type: 'success', msg: data.message } }))
    })
    socket.on('bid:created', (data)=>{
      window.dispatchEvent(new CustomEvent('gigflow:realtime', { detail: { type: 'bid:created', data } }))
      window.dispatchEvent(new CustomEvent('gigflow:toast', { detail: { type: 'info', msg: 'New bid received' } }))
    })
    socket.on('gig:created', (data)=>{
      window.dispatchEvent(new CustomEvent('gigflow:realtime', { detail: { type: 'gig:created', data } }))
      window.dispatchEvent(new CustomEvent('gigflow:toast', { detail: { type: 'info', msg: 'New gig posted' } }))
    })
    socket.on('gig:updated', (data)=>{
      window.dispatchEvent(new CustomEvent('gigflow:realtime', { detail: { type: 'gig:updated', data } }))
    })
    socket.on('disconnect', ()=>{})
    return ()=> socket.disconnect()
  }, [user])

  // close dropdown on outside click
  useEffect(()=>{
    function onDoc(e){
      if (!open) return
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('click', onDoc)
    return ()=> document.removeEventListener('click', onDoc)
  }, [open])

  const doLogout = async ()=>{
    try{
      await dispatch(logout()).unwrap()
    }catch(e){}
    navigate('/')
  }

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow">
        <div className="container px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <Link to="/" className="font-bold text-2xl text-indigo-600">GigFlow</Link>
            <nav className="hidden md:flex items-center gap-3 text-sm text-gray-600">
              <Link to="/" className="px-3 py-1 rounded-md hover:bg-indigo-50">Gigs</Link>
              <Link to="/post" className="px-3 py-1 rounded-md hover:bg-indigo-50">Post Gig</Link>
              <Link to="/dashboard/client" className="px-3 py-1 rounded-md hover:bg-indigo-50">My Gigs</Link>
              <Link to="/dashboard/freelancer" className="px-3 py-1 rounded-md hover:bg-indigo-50">My Bids</Link>
            </nav>
          </div>
          <div className="relative">
            {user ? (
              <div className="flex items-center gap-3">
                <div ref={ref} className="relative">
                  <button onClick={()=>setOpen(s=>!s)} className="flex items-center gap-2 px-3 py-1 rounded-md hover:bg-gray-100">
                    <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">{initials(user.name)}</div>
                    <div className="text-sm text-gray-700">{niceName(user.name)}</div>
                  </button>
                  {open && (
                    <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-20">
                    <div className="p-3 border-b">
                      <div className="text-sm font-medium">{niceName(user.name)}</div>
                      <div className="text-xs text-gray-500">{user.email}</div>
                    </div>
                    <div className="p-2">
                      <Link to="/dashboard/client" className="block px-3 py-2 rounded hover:bg-gray-50">My Gigs</Link>
                      <Link to="/dashboard/freelancer" className="block px-3 py-2 rounded hover:bg-gray-50">My Bids</Link>
                      <button onClick={doLogout} className="w-full text-left mt-2 px-3 py-2 rounded bg-red-50 text-red-600">Logout</button>
                    </div>
                  </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-x-3">
                <Link to="/login" className="text-sm text-gray-600 px-3 py-1 rounded-md hover:bg-gray-100">Login</Link>
                <Link to="/register" className="text-sm text-gray-600 px-3 py-1 rounded-md hover:bg-gray-100">Register</Link>
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-8 flex-1">{children}</main>

      <footer className="bg-white border-t py-4">
        <div className="container mx-auto px-6 text-sm text-gray-500">© GigFlow</div>
      </footer>

      <ToastContainer />
    </div>
  )
}
