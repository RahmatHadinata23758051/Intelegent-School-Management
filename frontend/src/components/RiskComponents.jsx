import React from 'react'
import { Card } from './ui/Card'
import {
  formatRiskScore,
  getRiskInsight,
  getRiskLabel,
  getRiskTone,
  normalizeRiskLevel,
} from '../utils/risk'

export const RiskBadge = ({ riskLevel }) => {
  const normalizedLevel = normalizeRiskLevel(riskLevel)
  const tone = getRiskTone(normalizedLevel)

  return (
    <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${tone.badge}`}>
      {getRiskLabel(normalizedLevel)}
    </span>
  )
}

export const RiskProgressBar = ({ score = 0, riskLevel, compact = false }) => {
  const normalizedLevel = normalizeRiskLevel(riskLevel)
  const tone = getRiskTone(normalizedLevel)
  const width = Math.max(0, Math.min(Number(score || 0), 100))

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-[0.16em] text-slate-500">
          Risk score
        </span>
        <span className={`text-sm font-semibold ${tone.text}`}>{formatRiskScore(width)}</span>
      </div>
      <div className={`overflow-hidden rounded-full bg-slate-200 ${compact ? 'h-2' : 'h-2.5'}`}>
        <div
          className={`h-full rounded-full ${tone.progress}`}
          style={{ width: `${width}%` }}
        />
      </div>
    </div>
  )
}

export const RiskScoreCard = ({ score, riskLevel, academicScore = 0, behavioralScore = 0 }) => {
  const normalizedLevel = normalizeRiskLevel(riskLevel)
  const tone = getRiskTone(normalizedLevel)

  return (
    <Card className="p-6">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="space-y-4">
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-cyan-700">
              Risk Summary
            </p>
            <div className="flex items-center gap-3">
              <h3 className="text-3xl font-semibold text-slate-900">
                {formatRiskScore(score)}
              </h3>
              <RiskBadge riskLevel={normalizedLevel} />
            </div>
            <p className="text-sm leading-6 text-slate-600">
              {getRiskInsight({
                academic_score: academicScore,
                behavioral_score: behavioralScore,
              })}
            </p>
          </div>
          <RiskProgressBar score={score} riskLevel={normalizedLevel} />
        </div>

        <div className="grid min-w-[16rem] grid-cols-2 gap-3">
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Academic
            </p>
            <p className="mt-2 text-2xl font-semibold text-slate-900">
              {formatRiskScore(academicScore)}
            </p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">
              Behavioral
            </p>
            <p className={`mt-2 text-2xl font-semibold ${tone.text}`}>
              {formatRiskScore(behavioralScore)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  )
}
