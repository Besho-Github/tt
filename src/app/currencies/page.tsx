"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { SearchBar } from '@/components/ui/search-bar'
import { TimeframeTabs } from '@/components/ui/timeframe-tabs'
import { BigChart } from '@/components/charts/big-chart'
import { MiniSparkline } from '@/components/charts/mini-sparkline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeRange, ExchangeRates, TimeSeriesPoint } from '@/types'
import { cn, formatNumber } from '@/lib/utils'

async function fetchExchangeRates(): Promise<ExchangeRates> {
  const response = await fetch('/api/rates?base=EGP')
  if (!response.ok) throw new Error('Failed to fetch exchange rates')
  return response.json()
}

// Mock function to generate exchange rate history
function generateRateHistory(rate: number, timeRange: TimeRange): TimeSeriesPoint[] {
  const now = new Date()
  const points = timeRange === '1D' ? 24 : timeRange === '1W' ? 7 : timeRange === '1M' ? 30 : 52
  const intervalMs = timeRange === '1D' ? 60 * 60 * 1000 : 24 * 60 * 60 * 1000
  
  const series: TimeSeriesPoint[] = []
  let currentRate = rate
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * intervalMs).toISOString()
    const change = (Math.random() - 0.5) * 0.001 * currentRate
    currentRate += change
    
    series.push({
      timestamp,
      price: Math.max(0, currentRate)
    })
  }
  
  return series
}

export default function CurrenciesPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1D')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedPair, setSelectedPair] = useState('USD')
  const router = useRouter()

  const { data: ratesData, isLoading } = useQuery({
    queryKey: ['exchange-rates'],
    queryFn: fetchExchangeRates,
  })

  const currencyPairs = [
    { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
    { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
  ]

  const filteredPairs = currencyPairs.filter(pair => 
    searchQuery === '' || 
    pair.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    pair.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedRate = ratesData?.rates[selectedPair] || 0
  const usdToEgp = 1 / (ratesData?.rates.USD || 0.0203)
  const rateHistory = generateRateHistory(usdToEgp, timeRange)

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
          <h1 className="text-3xl font-bold text-green-500">Exchange Rates</h1>
        </div>
        <Button
          onClick={() => router.push('/convert')}
          className="bg-green-500 hover:bg-green-600"
        >
          <ArrowUpDown className="h-4 w-4 mr-2" />
          Convert
        </Button>
      </div>

      {/* Search */}
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search currency pairs"
      />

      {/* Main Chart - USD/EGP */}
      <Card className="bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-green-500">
              USD/EGP Exchange Rate
            </CardTitle>
            <TimeframeTabs 
              value={timeRange} 
              onValueChange={setTimeRange}
              className="bg-green-500/10"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoading ? (
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="h-[400px] bg-muted animate-pulse rounded" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-green-500">
                  {formatNumber(usdToEgp)} EGP
                </div>
                <div className="text-muted-foreground">
                  1 USD = {formatNumber(usdToEgp)} EGP
                </div>
              </div>
              
              <BigChart 
                data={rateHistory}
                type="line"
                color="#10b981"
                currency="EGP"
                height={400}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Currency Pairs */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">Currency Pairs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {isLoading ? (
            Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-16 bg-muted rounded" />
                      <div className="h-3 w-24 bg-muted rounded" />
                    </div>
                    <div className="space-y-2">
                      <div className="h-4 w-20 bg-muted rounded" />
                      <div className="h-3 w-16 bg-muted rounded" />
                    </div>
                    <div className="h-10 w-24 bg-muted rounded" />
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            filteredPairs.map((pair) => {
              const rate = ratesData?.rates[pair.code] || 0
              const egpToCurrency = rate
              const currencyToEgp = 1 / rate
              const mockHistory = generateRateHistory(currencyToEgp, '1D').slice(-10)
              
              return (
                <Card 
                  key={pair.code}
                  className={cn(
                    "cursor-pointer transition-all hover:shadow-md",
                    selectedPair === pair.code && "ring-2 ring-green-500"
                  )}
                  onClick={() => router.push(`/convert?from=EGP&to=${pair.code}`)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="text-2xl">{pair.flag}</span>
                          <div>
                            <div className="font-bold text-green-500">
                              EGP/{pair.code}
                            </div>
                            <div className="text-sm text-muted-foreground">
                              {pair.name}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right space-y-1">
                        <div className="font-semibold">
                          {formatNumber(egpToCurrency)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          1 EGP = {formatNumber(egpToCurrency)} {pair.code}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          1 {pair.code} = {formatNumber(currencyToEgp)} EGP
                        </div>
                      </div>
                      
                      <div className="w-24">
                        <MiniSparkline 
                          data={mockHistory}
                          color="#10b981"
                          height={40}
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })
          )}
        </div>
      </div>

      {/* Last Updated */}
      {ratesData && (
        <div className="text-center text-sm text-muted-foreground">
          Last updated: {new Date(ratesData.lastUpdated).toLocaleString('en-EG')}
        </div>
      )}
    </div>
  )
}

