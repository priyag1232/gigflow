import React from 'react'
import Badge from './Badge'

export default function Card({ gig, children }){
  return (
    <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-150 overflow-hidden transform hover:-translate-y-0.5">
      <div className="p-4">
        <div className="flex justify-between items-start gap-4">
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold truncate">{gig.title}</h3>
            <p className="text-sm text-gray-600 mt-1 overflow-hidden" style={{maxHeight: '3.5rem'}}>{gig.description}</p>
          </div>
          <div className="flex-shrink-0 text-right">
            <div className="text-sm text-gray-500">Budget</div>
            <div className="text-lg font-bold text-gray-900">${gig.budget}</div>
            <div className="mt-2">
              <Badge variant={gig.status === 'open' ? 'open' : 'assigned'}>{gig.status}</Badge>
            </div>
          </div>
        </div>
      </div>
      <div className="p-3 border-t bg-gray-50 flex items-center justify-end">
        {children}
      </div>
    </div>
  )
}
