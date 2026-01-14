import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import useDebounce from '../hooks/useDebounce'
import { fetchGigs } from '../redux/slices/gigsSlice'
import Spinner from './Spinner'

export default function Banner(){
  const dispatch = useDispatch()
  const [q, setQ] = useState('')
  const debouncedQ = useDebounce(q, 450)
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    let mounted = true
    setLoading(true)
    dispatch(fetchGigs({ search: debouncedQ })).then(()=>{ if(mounted) setLoading(false) }).catch(()=>{ if(mounted) setLoading(false) })
    return ()=> mounted = false
  }, [debouncedQ, dispatch])

  return (
    <div className="rounded-lg overflow-hidden mb-6">
      <div className="bg-gradient-to-r from-indigo-600 via-indigo-500 to-teal-400 text-white p-6 lg:p-10 rounded-lg shadow-lg">
        <div className="container mx-auto flex flex-col lg:flex-row items-center gap-6">
          <div className="flex-1">
            <h1 className="text-3xl lg:text-4xl font-extrabold leading-tight">Find talent. Get work done.</h1>
            <p className="mt-3 text-indigo-100 max-w-xl">Post projects, receive bids, and hire trusted freelancers — all in one place. Fast, secure, and professional.</p>

            <div className="mt-6 w-full max-w-2xl">
              <div className="flex items-center gap-3">
                <div className="relative flex-1">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-indigo-100">🔍</span>
                  <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search gigs, e.g. logo design" className="w-full pl-12 pr-12 border border-white/30 bg-white/10 placeholder-indigo-100 text-white rounded-full py-3 focus:outline-none focus:ring-2 focus:ring-white/30" />
                  {q && <button onClick={()=>setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-indigo-100">✕</button>}
                </div>
                <button onClick={async ()=>{
                    setLoading(true)
                    try{
                      await dispatch(fetchGigs({ search: q.trim() }))
                    }catch(e){}
                    setLoading(false)
                  }} className="bg-white text-indigo-700 px-5 py-2 rounded-full font-semibold shadow hover:opacity-95 flex items-center gap-2">
                  {loading ? <Spinner size={4} /> : 'Search'}
                </button>
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <Link to="/post" className="bg-white text-indigo-700 px-4 py-2 rounded-md font-medium shadow hover:opacity-95">Post a Gig</Link>
              <Link to="/" className="text-white bg-white/10 px-4 py-2 rounded-md font-medium hover:bg-white/20">Browse Gigs</Link>
            </div>
          </div>

          <div className="w-full lg:w-1/3">
            <svg viewBox="0 0 200 120" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid meet">
              <defs>
                <linearGradient id="g1" x1="0" x2="1" y1="0" y2="1">
                  <stop offset="0%" stopColor="#fff" stopOpacity="0.15" />
                  <stop offset="100%" stopColor="#fff" stopOpacity="0.05" />
                </linearGradient>
              </defs>
              <rect x="0" y="0" width="200" height="120" rx="8" fill="url(#g1)" />
              <g fill="none" stroke="#fff" strokeOpacity="0.9" strokeWidth="1.5">
                <path d="M10 90 C 40 20, 160 20, 190 90" />
                <circle cx="60" cy="60" r="6" />
                <circle cx="140" cy="60" r="8" />
              </g>
            </svg>
          </div>
        </div>
      </div>
    </div>
  )
}
