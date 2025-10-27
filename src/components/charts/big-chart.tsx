"use client"

import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line
} from 'recharts'
import { TimeSeriesPoint } from '@/types'
import { formatCurrency } from '@/lib/utils'

interface BigChartProps {
  data: TimeSeriesPoint[]
  type?: 'area' | 'line'
  color?: string
  currency?: string
  height?: number
}

export function BigChart({ 
  data, 
  type = 'area',
  color = '#10b981',
  currency = 'EGP',
  height = 300
}: BigChartProps) {
  if (!data || data.length === 0) {
    return (
      <div 
        className={`h-[${height}px] w-full bg-muted/20 rounded-lg flex items-center justify-center`}
      >
        <p className="text-muted-foreground">No data available</p>
      </div>
    )
  }

  // Transform data for Recharts
  const chartData = data.map(point => ({
    value: point.price,
    timestamp: new Date(point.timestamp).getTime(),
    formattedTime: new Date(point.timestamp).toLocaleDateString('en-EG', {
      month: 'short',
      day: 'numeric',
      hour: data.length <= 24 ? 'numeric' : undefined
    })
  }))

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const value = payload[0].value
      const time = new Date(label).toLocaleString('en-EG')
      
      return (
        <div className="bg-card border rounded-lg p-3 shadow-lg">
          <p className="text-sm text-muted-foreground">{time}</p>
          <p className="font-semibold">
            {formatCurrency(value, currency)}
          </p>
        </div>
      )
    }
    return null
  }

  const commonProps = {
    data: chartData,
    margin: { top: 5, right: 30, left: 20, bottom: 5 }
  }

  return (
    <div className={`h-[${height}px] w-full`}>
      <ResponsiveContainer width="100%" height="100%">
        {type === 'area' ? (
          <AreaChart {...commonProps}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.3}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="formattedTime"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value, currency).split(' ')[0]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorGradient)"
            />
          </AreaChart>
        ) : (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis 
              dataKey="formattedTime"
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis 
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => formatCurrency(value, currency).split(' ')[0]}
            />
            <Tooltip content={<CustomTooltip />} />
            <Line
              type="monotone"
              dataKey="value"
              stroke={color}
              strokeWidth={2}
              dot={false}
              activeDot={{ r: 4, stroke: color, strokeWidth: 2 }}
            />
          </LineChart>
        )}
      </ResponsiveContainer>
    </div>
  )
}

