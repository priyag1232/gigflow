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
