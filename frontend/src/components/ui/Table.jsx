import React from 'react'

export const Table = ({ children, className = '' }) => {
  return (
    <div className={`overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm shadow-slate-950/5 ${className}`}>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200 text-left text-sm text-slate-700">
          {children}
        </table>
      </div>
    </div>
  )
}

export const TableHead = ({ children }) => {
  return <thead className="bg-slate-50/90">{children}</thead>
}

export const TableBody = ({ children }) => {
  return <tbody className="divide-y divide-slate-200">{children}</tbody>
}

export const TableRow = ({ children, className = '' }) => {
  return (
    <tr className={`odd:bg-white even:bg-slate-50/50 hover:bg-cyan-50/50 ${className}`}>
      {children}
    </tr>
  )
}

export const TableHeaderCell = ({ children, className = '' }) => {
  return (
    <th className={`px-6 py-3 text-xs font-semibold uppercase tracking-[0.16em] text-slate-500 ${className}`}>
      {children}
    </th>
  )
}

export const TableCell = ({ children, className = '' }) => {
  return <td className={`px-6 py-4 align-top ${className}`}>{children}</td>
}
