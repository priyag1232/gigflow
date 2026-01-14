import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'
import { useSelector } from 'react-redux'
import Spinner from '../components/Spinner'
import Badge from '../components/Badge'

export default function GigDetails(){
  const { id } = useParams()
  const [gig, setGig] = useState(null)
  const [loading, setLoading] = useState(true)
  const [message,setMessage]=useState('')
  const [price,setPrice]=useState('')
  const [submitting,setSubmitting]=useState(false)
  const [bids,setBids]=useState([])
  const [bidsLoading,setBidsLoading]=useState(false)
  const user = useSelector(s=>s.auth.user)

  useEffect(()=>{
    let mounted = true
    api.get(`/api/gigs/${id}`).then(r=>{ if(mounted) setGig(r.data) }).finally(()=>{ if(mounted) setLoading(false) })
    return ()=> mounted=false
  },[id])

  useEffect(()=>{
    if (!gig) return
    if (user && gig.ownerId && user.id === gig.ownerId._id){
      setBidsLoading(true)
      api.get(`/api/bids/${id}`).then(r=> setBids(r.data)).finally(()=> setBidsLoading(false))
    }
  }, [gig, user, id])

  // listen for realtime events to refresh bids/gig
  useEffect(()=>{
    const handler = (e) => {
      const detail = e.detail || {}
      if (detail.type === 'bid:created' && detail.data && detail.data.bid) {
        const b = detail.data.bid
        if (b.gigId === id && user && gig && user.id === gig.ownerId._id) {
          // prepend new bid
          setBids(prev => [b, ...prev])
        }
      }
      if (detail.type === 'gig:updated' && detail.data && detail.data.gigId === id) {
        // refresh gig status
        api.get(`/api/gigs/${id}`).then(r=> setGig(r.data))
      }
    }
    window.addEventListener('gigflow:realtime', handler)
    return ()=> window.removeEventListener('gigflow:realtime', handler)
  }, [id, user, gig])

  const submitBid = async (e)=>{
    e.preventDefault()
    setSubmitting(true)
    try{
      await api.post('/api/bids', { gigId: id, message, price: Number(price) })
      window.dispatchEvent(new CustomEvent('gigflow:toast', { detail: { type: 'success', msg: 'Bid placed' } }))
    }catch(err){
      window.dispatchEvent(new CustomEvent('gigflow:toast', { detail: { type: 'error', msg: err?.response?.data?.message || 'Failed' } }))
    }finally{ setSubmitting(false) }
  }

  const hire = async (bidId) => {
    try{
      await api.patch(`/api/bids/${bidId}/hire`)
      window.dispatchEvent(new CustomEvent('gigflow:toast', { detail: { type: 'success', msg: 'Freelancer hired' } }))
      // refresh bids and gig
      setBidsLoading(true)
      const [bRes, gRes] = await Promise.all([api.get(`/api/bids/${id}`), api.get(`/api/gigs/${id}`)])
      setBids(bRes.data); setGig(gRes.data)
      setBidsLoading(false)
    }catch(err){
      window.dispatchEvent(new CustomEvent('gigflow:toast', { detail: { type: 'error', msg: err?.response?.data?.message || 'Failed to hire' } }))
    }
  }

  if(loading) return <div className="flex items-center justify-center py-20"><Spinner size={8} /></div>
  if(!gig) return <div className="text-center text-gray-500">Not found</div>

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-semibold">{gig.title}</h2>
        <div className="mt-2 text-sm text-gray-600">by {gig.ownerId?.name} • <Badge variant={gig.status==='open'?'open':'assigned'}>{gig.status}</Badge></div>
        <div className="mt-6 text-gray-700 whitespace-pre-line">{gig.description}</div>
      </div>

      <aside className="lg:col-span-1">
        <div className="sticky top-20 bg-white p-6 rounded shadow">
          <div className="text-sm text-gray-500">Budget</div>
          <div className="text-2xl font-bold text-gray-900">${gig.budget}</div>
          <div className="mt-4">
            {user && gig.ownerId && user.id !== gig.ownerId._id && gig.status==='open' && (
              <form onSubmit={submitBid} className="space-y-3">
                <label className="block text-sm text-gray-700">Message</label>
                <textarea value={message} onChange={e=>setMessage(e.target.value)} className="w-full border rounded px-3 py-2 text-sm" rows={3} />
                <label className="block text-sm text-gray-700">Your price</label>
                <input value={price} onChange={e=>setPrice(e.target.value)} type="number" className="w-full border rounded px-3 py-2 text-sm" />
                <button disabled={submitting} className="w-full bg-indigo-600 text-white py-2 rounded flex items-center justify-center">
                  {submitting ? <Spinner size={4} /> : 'Place Bid'}
                </button>
              </form>
            )}

            {gig.status!=='open' && (<div className="mt-4 text-sm text-red-600">This gig is assigned</div>)}
          </div>
        </div>

        {user && gig.ownerId && user.id === gig.ownerId._id && (
          <div className="mt-4 bg-white p-4 rounded shadow">
            <h4 className="font-semibold">Bids</h4>
            {bidsLoading ? <div className="py-4"><Spinner size={6} /></div> : (
              bids.length === 0 ? <div className="text-sm text-gray-500 py-4">No bids yet.</div> : (
                <div className="space-y-3 mt-3">
                  {bids.map(b => (
                    <div key={b._id} className="border rounded p-3">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-sm font-medium">{b.freelancerId?.name}</div>
                          <div className="text-xs text-gray-500">${b.price} • {new Date(b.createdAt).toLocaleString()}</div>
                        </div>
                        <div className="text-sm">
                          <Badge variant={b.status === 'pending' ? 'neutral' : b.status}>{b.status}</Badge>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-gray-700">{b.message}</div>
                      <div className="mt-3 flex gap-2 justify-end">
                        <button disabled={gig.status!=='open' || b.status!=='pending'} onClick={()=>hire(b._id)} className="bg-indigo-600 text-white px-3 py-1 rounded">Hire</button>
                      </div>
                    </div>
                  ))}
                </div>
              )
            )}
          </div>
        )}
      </aside>
    </div>
  )
}
