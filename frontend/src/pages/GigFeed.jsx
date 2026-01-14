import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { fetchGigs } from '../redux/slices/gigsSlice'
import { Link } from 'react-router-dom'
import Card from '../components/Card'
import Banner from '../components/Banner'
import Spinner from '../components/Spinner'

export default function GigFeed(){
  const dispatch = useDispatch()
  const { items, loading } = useSelector(s => s.gigs)
  useEffect(()=>{ dispatch(fetchGigs({ search: '' })) }, [])
  
  useEffect(()=>{
    const handler = (e) => {
      const detail = e.detail || {}
      if (detail.type === 'gig:created' || detail.type === 'gig:updated') {
        dispatch(fetchGigs({ search: '' }))
      }
    }
    window.addEventListener('gigflow:realtime', handler)
    return ()=> window.removeEventListener('gigflow:realtime', handler)
  }, [dispatch])

  return (
    <div>
      <Banner />
      <div className="flex gap-3 mb-6">
        <div className="relative flex-1">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search gigs, e.g. logo design" className="w-full pl-10 border border-gray-200 px-4 py-3 rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-200" />
          {q && <button onClick={()=>setQ('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">✕</button>}
        </div>
        <div className="w-36">
          <button onClick={()=>dispatch(fetchGigs({ search: q }))} className="w-full bg-indigo-600 text-white px-4 py-3 rounded shadow hover:bg-indigo-700 flex items-center justify-center gap-2">
            {loading ? <Spinner size={4} /> : 'Search'}
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20"><Spinner size={8} /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.length === 0 && (
            <div className="col-span-full text-center text-gray-500 py-12">No gigs found.</div>
          )}
          {items.map(g => (
            <Card key={g._id} gig={g}>
              <Link to={`/gigs/${g._id}`} className="bg-white border border-indigo-600 text-indigo-600 px-4 py-1 rounded hover:bg-indigo-50">View Details</Link>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
