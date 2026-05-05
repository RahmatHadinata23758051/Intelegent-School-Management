import React from 'react'

export const Card = ({ as: Component = 'div', className = '', children }) => {
  return (
    <Component
      className={`rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-950/5 ${className}`}
    >
      {children}
    </Component>
  )
}
