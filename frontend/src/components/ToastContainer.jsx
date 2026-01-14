import React, { useEffect, useState } from 'react'

function Toast({ id, type='info', msg, onClose }){
  const colors = {
    info: 'bg-blue-600',
    success: 'bg-green-600',
    error: 'bg-red-600'
  }
  return (
    <div className={`text-white px-4 py-2 rounded shadow ${colors[type] || colors.info}`}> 
      <div className="flex items-center justify-between gap-4">
        <div className="text-sm">{msg}</div>
        <button onClick={() => onClose(id)} className="opacity-80 hover:opacity-100">✕</button>
      </div>
    </div>
  )
}

export default function ToastContainer(){
  const [toasts, setToasts] = useState([])

  useEffect(()=>{
    function handler(e){
      const t = { id: Date.now()+Math.random(), type: e.detail?.type || 'info', msg: e.detail?.msg || e.detail }
      setToasts(s => [t, ...s])
      setTimeout(()=> setToasts(s => s.filter(x => x.id !== t.id)), 5000)
    }
    window.addEventListener('gigflow:toast', handler)
    return ()=> window.removeEventListener('gigflow:toast', handler)
  }, [])

  const remove = (id) => setToasts(s => s.filter(t => t.id !== id))

  if (!toasts.length) return null
  return (
    <div className="fixed right-4 top-4 z-50 space-y-2">
      {toasts.map(t => <Toast key={t.id} {...t} onClose={remove} />)}
    </div>
  )
}
