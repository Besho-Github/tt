"use client"

import { TimeRange } from '@/types'
import { cn } from '@/lib/utils'

interface TimeframeTabsProps {
  value: TimeRange
  onValueChange: (value: TimeRange) => void
  className?: string
}

const timeframes: { value: TimeRange; label: string }[] = [
  { value: '1D', label: '1D' },
  { value: '1W', label: '1W' },
  { value: '1M', label: '1M' },
  { value: '1Y', label: '1Y' },
]

export function TimeframeTabs({ value, onValueChange, className }: TimeframeTabsProps) {
  return (
    <div className={cn("flex rounded-lg bg-muted p-1", className)}>
      {timeframes.map((timeframe) => (
        <button
          key={timeframe.value}
          onClick={() => onValueChange(timeframe.value)}
          className={cn(
            "flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-all",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
            value === timeframe.value
              ? "bg-background text-foreground shadow-sm"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          {timeframe.label}
        </button>
      ))}
    </div>
  )
}

