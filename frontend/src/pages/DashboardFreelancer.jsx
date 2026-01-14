import React, { useEffect, useState } from 'react'
import { useSelector } from 'react-redux'
import Spinner from '../components/Spinner'
import api from '../services/api'

export default function DashboardFreelancer(){
  const user = useSelector(s=>s.auth.user)
  const [notifications, setNotifications] = useState([])
  const [bids, setBids] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(()=>{
    function handler(e){
      setNotifications(n => [e.detail?.msg || e.detail, ...n])
    }
    window.addEventListener('gigflow:toast', handler)
    return ()=> window.removeEventListener('gigflow:toast', handler)
  }, [])

  useEffect(()=>{
    let mounted = true
    if (!user) { setLoading(false); return }
    api.get('/api/bids/me').then(r=>{ if(mounted) setBids(r.data) }).catch(err=>{ if(mounted) console.error('Failed to fetch bids', err) }).finally(()=>{ if(mounted) setLoading(false) })
    return ()=> mounted=false
  }, [user])

  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">My Bids</h2>
      {!user && <div className="text-gray-500">Login to see your dashboard.</div>}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="md:col-span-2 bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Your Bids</h3>
          {loading ? <div className="py-4"><Spinner size={6} /></div> : (
            bids.length === 0 ? <div className="text-sm text-gray-500">You have not placed any bids yet.</div> : (
              <div className="space-y-3">
                {bids.map(b => (
                  <div key={b._id} className="border rounded p-3">
                    <div className="flex justify-between items-start">
                      <div>
                        <div className="text-sm font-medium">{b.gigId?.title || '—'}</div>
                        <div className="text-xs text-gray-500">${b.price} • {new Date(b.createdAt).toLocaleString()}</div>
                      </div>
                      <div className="text-sm">
                        <span className="badge">{b.status}</span>
                      </div>
                    </div>
                    <div className="mt-2 text-sm text-gray-700">{b.message}</div>
                  </div>
                ))}
              </div>
            )
          )}
        </div>
        <div className="bg-white p-4 rounded shadow">
          <h3 className="font-semibold mb-2">Notifications</h3>
          {notifications.length === 0 ? (
            <div className="text-sm text-gray-500">No notifications yet.</div>
          ) : (
            <ul className="space-y-2 text-sm">
              {notifications.map((n,i)=> <li key={i} className="text-gray-700">{n}</li>)}
            </ul>
          )}
        </div>
      </div>
    </div>
  )
}
