import React from 'react'
import { Card } from './ui/Card'

const toneClasses = {
  neutral: 'border-slate-200 bg-white',
  danger: 'border-rose-200 bg-rose-50/40',
}

export const StatePanel = ({
  title,
  description,
  icon,
  actionLabel,
  onAction,
  tone = 'neutral',
  className = '',
}) => {
  return (
    <Card className={`p-6 ${toneClasses[tone] || toneClasses.neutral} ${className}`}>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-4">
          {icon && (
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-900 text-white">
              {icon}
            </div>
          )}
          <div className="space-y-1">
            <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
            <p className="text-sm leading-6 text-slate-600">{description}</p>
          </div>
        </div>
        {actionLabel && onAction && (
          <button
            type="button"
            onClick={onAction}
            className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-cyan-300 hover:text-cyan-700"
          >
            {actionLabel}
          </button>
        )}
      </div>
    </Card>
  )
}
