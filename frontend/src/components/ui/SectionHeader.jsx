import React from 'react'

export const SectionHeader = ({
  eyebrow,
  title,
  description,
  actions = null,
  className = '',
}) => {
  return (
    <div className={`flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between ${className}`}>
      <div className="space-y-2">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
            {eyebrow}
          </p>
        )}
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold text-slate-900">{title}</h2>
          {description && (
            <p className="max-w-3xl text-sm leading-6 text-slate-600">
              {description}
            </p>
          )}
        </div>
      </div>
      {actions && <div className="flex items-center gap-3">{actions}</div>}
    </div>
  )
}
