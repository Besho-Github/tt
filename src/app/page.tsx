"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/ui/search-bar'
import { PriceCard } from '@/components/ui/price-card'
import { TimeframeTabs } from '@/components/ui/timeframe-tabs'
import { BigChart } from '@/components/charts/big-chart'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeRange, GoldData } from '@/types'

async function fetchGoldData(range: TimeRange): Promise<GoldData> {
  const response = await fetch(`/api/gold?base=EGP&range=${range}`)
  if (!response.ok) throw new Error('Failed to fetch gold data')
  return response.json()
}

export default function HomePage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1D')
  const [searchQuery, setSearchQuery] = useState('')
  const router = useRouter()

  const { data: goldData, isLoading } = useQuery({
    queryKey: ['gold', 'EGP', timeRange],
    queryFn: () => fetchGoldData(timeRange),
  })

  const navigationTiles = [
    {
      title: 'Gold Prices',
      subtitle: '21K, 24K, 18K, Ounce',
      href: '/gold',
      color: '#fbbf24'
    },
    {
      title: 'Stocks',
      subtitle: 'EGX30, COMI, FWRY',
      href: '/stocks',
      color: '#3b82f6'
    },
    {
      title: 'Silver Prices',
      subtitle: 'Per gram, Per ounce',
      href: '/silver',
      color: '#6b7280'
    },
    {
      title: 'Currencies',
      subtitle: 'USD, EUR, GBP, SAR',
      href: '/currencies',
      color: '#10b981'
    }
  ]

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Egyptian Finance</h1>
        <SearchBar 
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="Search for gold, silver, stock, or currency"
        />
      </div>

      {/* Main Gold Card */}
      <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gold">Gold 21K (EGP)</CardTitle>
            <TimeframeTabs 
              value={timeRange} 
              onValueChange={setTimeRange}
              className="bg-gold/10"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="h-[300px] bg-muted animate-pulse rounded" />
            </div>
          ) : goldData ? (
            <>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-gold">
                  {goldData.headline.price.toLocaleString('en-EG', {
                    style: 'currency',
                    currency: 'EGP'
                  })}
                </div>
                <div className={`flex items-center gap-2 text-lg font-medium ${
                  goldData.headline.changePct >= 0 ? 'text-success' : 'text-danger'
                }`}>
                  <span>{goldData.headline.changePct >= 0 ? '↗' : '↘'}</span>
                  <span>{goldData.headline.changePct >= 0 ? '+' : ''}{goldData.headline.changePct.toFixed(2)}%</span>
                </div>
              </div>
              
              <BigChart 
                data={goldData.series}
                type="area"
                color="#fbbf24"
                currency="EGP"
                height={300}
              />
            </>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Failed to load data
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation Tiles */}
      <div className="grid grid-cols-2 gap-4">
        {navigationTiles.map((tile) => (
          <Card 
            key={tile.title}
            className="cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
            onClick={() => router.push(tile.href)}
          >
            <CardHeader className="pb-2">
              <CardTitle 
                className="text-lg"
                style={{ color: tile.color }}
              >
                {tile.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{tile.subtitle}</p>
              <div className="mt-2 text-xs text-muted-foreground">
                Last updated: {new Date().toLocaleTimeString('en-EG', {
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}

