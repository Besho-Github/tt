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
import { TimeRange, SilverData, Currency } from '@/types'
import { cn } from '@/lib/utils'

async function fetchSilverData(base: Currency, range: TimeRange): Promise<SilverData> {
  const response = await fetch(`/api/silver?base=${base}&range=${range}`)
  if (!response.ok) throw new Error('Failed to fetch silver data')
  return response.json()
}

export default function SilverPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1D')
  const [currency, setCurrency] = useState<Currency>('EGP')
  const [searchQuery, setSearchQuery] = useState('')

  const { data: silverData, isLoading } = useQuery({
    queryKey: ['silver', currency, timeRange],
    queryFn: () => fetchSilverData(currency, timeRange),
  })

  const filteredUnits = silverData?.others.filter(item => 
    searchQuery === '' || 
    item.unit.includes(searchQuery.toLowerCase())
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
          <h1 className="text-3xl font-bold text-slate-400">Silver Prices</h1>
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
        placeholder="Search by unit (gram, ounce)"
      />

      {/* Main Chart - Silver per gram */}
      <Card className="bg-gradient-to-br from-slate-500/10 to-slate-500/5 border-slate-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-slate-400">
              Silver per Gram ({currency})
            </CardTitle>
            <TimeframeTabs 
              value={timeRange} 
              onValueChange={setTimeRange}
              className="bg-slate-500/10"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="h-[400px] bg-muted animate-pulse rounded" />
            </div>
          ) : silverData ? (
            <>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-slate-400">
                  {silverData.headline.price.toLocaleString('en-EG', {
                    style: 'currency',
                    currency: currency
                  })}
                </div>
                <div className={cn(
                  "flex items-center gap-2 text-lg font-medium",
                  silverData.headline.changePct >= 0 ? 'text-success' : 'text-danger'
                )}>
                  <span>{silverData.headline.changePct >= 0 ? '↗' : '↘'}</span>
                  <span>
                    {silverData.headline.changePct >= 0 ? '+' : ''}
                    {silverData.headline.changePct.toFixed(2)}%
                  </span>
                </div>
              </div>
              
              <BigChart 
                data={silverData.series}
                type="area"
                color="#6b7280"
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

      {/* Other Units */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Other Units</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            Array.from({ length: 2 }).map((_, i) => (
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
            filteredUnits.map((item) => (
              <PriceCard
                key={item.unit}
                title={`Silver per ${item.unit === 'gram' ? 'Gram' : 'Ounce'}`}
                price={item.price}
                changePct={item.changePct}
                currency={currency}
                sparklineData={item.seriesMini}
                sparklineColor="#6b7280"
                className="border-slate-500/20 hover:border-slate-500/40"
              />
            ))
          )}
        </div>
      </div>

      {/* Last Updated */}
      {silverData && (
        <div className="text-center text-sm text-muted-foreground">
          Last updated: {new Date(silverData.lastUpdated).toLocaleString('en-EG')}
        </div>
      )}
    </div>
  )
}

