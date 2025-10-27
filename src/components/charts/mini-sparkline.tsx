"use client"

import { LineChart, Line, ResponsiveContainer } from 'recharts'
import { TimeSeriesPoint } from '@/types'

interface MiniSparklineProps {
  data: TimeSeriesPoint[]
  color?: string
  height?: number
}

export function MiniSparkline({ 
  data, 
  color = '#10b981', 
  height = 40 
}: MiniSparklineProps) {
  if (!data || data.length === 0) {
    return <div className={`h-[${height}px] w-full bg-muted/20 rounded`} />
  }

  // Transform data for Recharts
  const chartData = data.map(point => ({
    value: point.price,
    timestamp: point.timestamp
  }))

  return (
    <div className={`h-[${height}px] w-full`}>
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={1.5}
            dot={false}
            activeDot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

