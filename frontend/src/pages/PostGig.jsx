import React, { useState } from 'react'
import { useDispatch } from 'react-redux'
import { createGig } from '../redux/slices/gigsSlice'
import { useNavigate } from 'react-router-dom'
import Spinner from '../components/Spinner'

export default function PostGig(){
  const [title,setTitle]=useState('')
  const [description,setDescription]=useState('')
  const [budget,setBudget]=useState('')
  const [loading,setLoading]=useState(false)
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const maxDesc = 1200

  const submit = async (e)=>{
    e.preventDefault();
    setLoading(true)
    try{
      await dispatch(createGig({ title, description, budget: Number(budget) })).unwrap()
      window.dispatchEvent(new CustomEvent('gigflow:toast', { detail: { type: 'success', msg: 'Gig posted' } }))
      navigate('/')
    }catch(err){
      window.dispatchEvent(new CustomEvent('gigflow:toast', { detail: { type: 'error', msg: err?.message || 'Failed to post gig' } }))
    }finally{setLoading(false)}
  }

  const budgetNumber = Number(budget) || 0

  return (
    <div className="max-w-5xl mx-auto p-6">
      <div className="bg-white rounded-xl shadow-md p-6">
        <h2 className="text-2xl font-semibold mb-4">Post a new Gig</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input required value={title} onChange={e=>setTitle(e.target.value)} placeholder="e.g. Build a marketing landing page" className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200" maxLength={120} />
              <p className="text-xs text-gray-400 mt-1">Keep it short and descriptive (max 120 chars)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required value={description} onChange={e=>setDescription(e.target.value)} placeholder="Describe the gig, deliverables, timeline and expectations" className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200" rows={8} maxLength={maxDesc} />
              <div className="flex justify-between text-xs text-gray-400 mt-1">
                <span>Include deliverables, acceptance criteria and timeline.</span>
                <span>{description.length}/{maxDesc}</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Budget (USD)</label>
              <input required type="number" value={budget} onChange={e=>setBudget(e.target.value)} placeholder="e.g. 500" className="w-full border border-gray-200 px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-indigo-200" min={0} />
              <p className="text-xs text-gray-400 mt-1">Fixed-price budget helps freelancers give accurate proposals.</p>
            </div>

            <button disabled={loading} className={`w-full flex items-center justify-center gap-2 ${loading ? 'bg-indigo-500 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'} text-white py-2 rounded`}>
              {loading ? <><Spinner size={4}/> Posting...</> : 'Post Gig'}
            </button>
          </form>

          <aside className="order-first md:order-last">
            <div className="sticky top-6 bg-gray-50 border border-gray-100 rounded-lg p-4">
              <h3 className="text-lg font-medium mb-2">Preview</h3>
              <div className="mb-3">
                <div className="text-sm text-gray-500">Title</div>
                <div className="font-semibold text-gray-900">{title || 'Gig title preview'}</div>
              </div>
              <div className="mb-3">
                <div className="text-sm text-gray-500">Description</div>
                <div className="text-sm text-gray-800 whitespace-pre-line">{description || 'A quick summary of the work, expected deliverables and timeline will show here.'}</div>
              </div>
              <div className="mb-3">
                <div className="text-sm text-gray-500">Budget</div>
                <div className="font-medium text-indigo-600">{budgetNumber > 0 ? `$${budgetNumber.toLocaleString()}` : 'Not set'}</div>
              </div>
              <div className="mt-3 text-xs text-gray-400">Your gig will appear on the marketplace once posted. You can edit it later.</div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  )
}
