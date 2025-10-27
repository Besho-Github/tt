"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { SearchBar } from '@/components/ui/search-bar'
import { PriceCard } from '@/components/ui/price-card'
import { TimeframeTabs } from '@/components/ui/timeframe-tabs'
import { BigChart } from '@/components/charts/big-chart'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeRange, GoldData, Currency } from '@/types'
import { cn } from '@/lib/utils'

async function fetchGoldData(base: Currency, range: TimeRange): Promise<GoldData> {
  const response = await fetch(`/api/gold?base=${base}&range=${range}`)
  if (!response.ok) throw new Error('Failed to fetch gold data')
  return response.json()
}

export default function GoldPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1D')
  const [currency, setCurrency] = useState<Currency>('EGP')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: goldData, isLoading } = useQuery({
    queryKey: ['gold', currency, timeRange],
    queryFn: () => fetchGoldData(currency, timeRange),
  })

  const filteredKarats = goldData?.others.filter(item => 
    searchQuery === '' || 
    item.karat.toString().includes(searchQuery.toLowerCase()) ||
    (item.karat === 'ounce' && 'ounce'.includes(searchQuery.toLowerCase()))
  ) || []

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gold">Gold Prices</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant={currency === 'EGP' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrency('EGP')}
          >
            EGP
          </Button>
          <Button
            variant={currency === 'USD' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setCurrency('USD')}
          >
            USD
          </Button>
        </div>
      </div>

      {/* Search */}
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by karat (21K, 24K, 18K, ounce)"
      />

      {/* Main Chart - 21K Gold */}
      <Card className="bg-gradient-to-br from-gold/10 to-gold/5 border-gold/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-gold">
              Gold 21K ({currency})
            </CardTitle>
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
              <div className="h-[400px] bg-muted animate-pulse rounded" />
            </div>
          ) : goldData ? (
            <>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-gold">
                  {goldData.headline.price.toLocaleString('en-EG', {
                    style: 'currency',
                    currency: currency
                  })}
                </div>
                <div className={cn(
                  "flex items-center gap-2 text-lg font-medium",
                  goldData.headline.changePct >= 0 ? 'text-success' : 'text-danger'
                )}>
                  <span>{goldData.headline.changePct >= 0 ? '↗' : '↘'}</span>
                  <span>
                    {goldData.headline.changePct >= 0 ? '+' : ''}
                    {goldData.headline.changePct.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <BigChart 
                data={goldData.series}
                type="area"
                color="#fbbf24"
                currency={currency}
                height={400}
              />
            </>
          ) : (
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Failed to load data
            </div>
          )}
        </CardContent>
      </Card>

      {/* Other Karats */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Other Karats</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-6">
                  <div className="space-y-3">
                    <div className="h-4 bg-muted rounded" />
                    <div className="h-8 bg-muted rounded" />
                    <div className="h-10 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredKarats.map((item) => (
              <PriceCard
                key={item.karat}
                title={`Gold ${item.karat === 'ounce' ? 'Ounce' : `${item.karat}K`}`}
                price={item.price}
                changePct={item.changePct}
                currency={currency}
                sparklineData={item.seriesMini}
                sparklineColor="#fbbf24"
                className="border-gold/20 hover:border-gold/40"
              />
            ))
          )}
        </div>
      </div>

      {/* Last Updated */}
      {goldData && (
        <div className="text-center text-sm text-muted-foreground">
          Last updated: {new Date(goldData.lastUpdated).toLocaleString('en-EG')}
        </div>
      )}
    </div>
  )
}

