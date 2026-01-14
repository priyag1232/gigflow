import React from 'react'

export default function Badge({ children, variant='neutral' }){
  const colors = {
    neutral: 'bg-gray-100 text-gray-800',
    open: 'bg-green-100 text-green-800',
    assigned: 'bg-yellow-100 text-yellow-800',
    hired: 'bg-indigo-100 text-indigo-800',
    rejected: 'bg-red-100 text-red-800'
  }
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${colors[variant] || colors.neutral}`}>
      {children}
    </span>
  )
}
