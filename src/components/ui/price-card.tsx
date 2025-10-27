"use client"

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { MiniSparkline } from '@/components/charts/mini-sparkline'
import { TimeSeriesPoint } from '@/types'
import { formatCurrency, formatPercentage, getChangeColor, getChangeIcon } from '@/lib/utils'
import { cn } from '@/lib/utils'

interface PriceCardProps {
  title: string
  price: number
  changePct: number
  currency?: string
  sparklineData?: TimeSeriesPoint[]
  sparklineColor?: string
  onClick?: () => void
  className?: string
}

export function PriceCard({
  title,
  price,
  changePct,
  currency = 'EGP',
  sparklineData,
  sparklineColor,
  onClick,
  className
}: PriceCardProps) {
  const changeColor = getChangeColor(changePct)
  const changeIcon = getChangeIcon(changePct)
  
  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg",
        onClick && "hover:bg-accent/50",
        className
      )}
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="space-y-1">
          <div className="text-2xl font-bold">
            {formatCurrency(price, currency)}
          </div>
          <div className={cn("flex items-center gap-1 text-sm font-medium", changeColor)}>
            <span>{changeIcon}</span>
            <span>{formatPercentage(changePct)}</span>
          </div>
        </div>
        
        {sparklineData && sparklineData.length > 0 && (
          <MiniSparkline 
            data={sparklineData} 
            color={sparklineColor || (changePct >= 0 ? '#10b981' : '#ef4444')}
            height={40}
          />
        )}
      </CardContent>
    </Card>
  )
}

