import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { login } from '../redux/slices/authSlice'
import { useNavigate } from 'react-router-dom'

export default function Login(){
  const [email,setEmail]=useState('')
  const [password,setPassword]=useState('')
  const [loading,setLoading]=useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const submit = async (e)=>{
    e.preventDefault()
    setLoading(true)
    try{
      await dispatch(login({ email, password })).unwrap()
      window.dispatchEvent(new CustomEvent('gigflow:toast', { detail: { type: 'success', msg: 'Logged in' } }))
      navigate('/')
    }catch(err){
      window.dispatchEvent(new CustomEvent('gigflow:toast', { detail: { type: 'error', msg: err?.message || 'Login failed' } }))
    }finally{setLoading(false)}
  }

  return (
    <div className="max-w-md mx-auto bg-white p-8 rounded-xl shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Welcome back</h2>
      <form onSubmit={submit} className="space-y-4">
        <label className="block text-sm text-gray-700">Email</label>
        <input required type="email" value={email} onChange={e=>setEmail(e.target.value)} placeholder="you@example.com" className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200" />
        <label className="block text-sm text-gray-700">Password</label>
        <input required type="password" value={password} onChange={e=>setPassword(e.target.value)} placeholder="••••••" className="w-full border border-gray-200 px-3 py-2 rounded" />
        <button disabled={loading} className="w-full bg-indigo-600 text-white py-2 rounded flex items-center justify-center">{loading? 'Loading...':'Login'}</button>
      </form>
    </div>
  )
}
