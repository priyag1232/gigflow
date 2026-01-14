import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import api from '../services/api'
import Card from '../components/Card'
import { Link } from 'react-router-dom'
import Spinner from '../components/Spinner'

export default function DashboardClient(){
  const user = useSelector(s=>s.auth.user)
  const [gigs, setGigs] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    let mounted = true
    api.get('/api/gigs').then(r=>{
      if(!mounted) return
      // filter gigs owned by current user
      const my = r.data.filter(g => g.ownerId && user && g.ownerId._id === user.id)
      setGigs(my)
    }).finally(()=> setLoading(false))
    return ()=> mounted=false
  }, [user])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Client Dashboard</h2>
      {loading ? <div className="py-8"><Spinner size={8} /></div> : (
        <div>
          {gigs.length === 0 && <div className="text-gray-500">You have no open gigs. Post a gig to receive bids.</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
            {gigs.map(g => (
              <Card key={g._id} gig={g}>
                <Link to={`/gigs/${g._id}`} className="bg-white border border-indigo-600 text-indigo-600 px-4 py-1 rounded">Manage</Link>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
