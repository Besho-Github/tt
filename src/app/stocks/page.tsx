"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, TrendingUp, TrendingDown } from 'lucide-react'
import Link from 'next/link'
import { SearchBar } from '@/components/ui/search-bar'
import { TimeframeTabs } from '@/components/ui/timeframe-tabs'
import { BigChart } from '@/components/charts/big-chart'
import { MiniSparkline } from '@/components/charts/mini-sparkline'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { TimeRange, StocksSummary } from '@/types'
import { cn, formatCurrency, formatNumber } from '@/lib/utils'

async function fetchStocksSummary(): Promise<StocksSummary> {
  const response = await fetch('/api/stocks/summary')
  if (!response.ok) throw new Error('Failed to fetch stocks data')
  return response.json()
}

async function fetchStockHistory(symbol: string, range: TimeRange) {
  const response = await fetch(`/api/stocks/history?symbol=${symbol}&range=${range}`)
  if (!response.ok) throw new Error('Failed to fetch stock history')
  return response.json()
}

export default function StocksPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>('1D')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedStock, setSelectedStock] = useState('COMI')

  const { data: stocksData, isLoading } = useQuery({
    queryKey: ['stocks-summary'],
    queryFn: fetchStocksSummary,
  })

  const { data: stockHistory, isLoading: isLoadingHistory } = useQuery({
    queryKey: ['stock-history', selectedStock, timeRange],
    queryFn: () => fetchStockHistory(selectedStock, timeRange),
    enabled: !!selectedStock,
  })

  const filteredStocks = stocksData?.table.filter(stock => 
    searchQuery === '' || 
    stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stock.name.toLowerCase().includes(searchQuery.toLowerCase())
  ) || []

  const selectedStockData = stocksData?.table.find(s => s.symbol === selectedStock)

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
          <h1 className="text-3xl font-bold text-blue-500">Egyptian Stocks</h1>
        </div>
      </div>

      {/* Search */}
      <SearchBar 
        value={searchQuery}
        onChange={setSearchQuery}
        placeholder="Search by symbol or company name"
      />

      {/* Main Chart - Selected Stock */}
      <Card className="bg-gradient-to-br from-blue-500/10 to-blue-500/5 border-blue-500/20">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-blue-500">
              {selectedStockData?.name || selectedStock} ({selectedStock})
            </CardTitle>
            <TimeframeTabs 
              value={timeRange} 
              onValueChange={setTimeRange}
              className="bg-blue-500/10"
            />
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {isLoadingHistory || !selectedStockData ? (
            <div className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded" />
              <div className="h-[400px] bg-muted animate-pulse rounded" />
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <div className="text-4xl font-bold text-blue-500">
                  {formatCurrency(selectedStockData.last, 'EGP')}
                </div>
                <div className={cn(
                  "flex items-center gap-2 text-lg font-medium",
                  selectedStockData.changePct >= 0 ? 'text-success' : 'text-danger'
                )}>
                  {selectedStockData.changePct >= 0 ? (
                    <TrendingUp className="h-5 w-5" />
                  ) : (
                    <TrendingDown className="h-5 w-5" />
                  )}
                  <span>
                    {selectedStockData.changePct >= 0 ? '+' : ''}
                    {selectedStockData.changePct.toFixed(2)}%
                  </span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Volume: {formatNumber(selectedStockData.volume)}
                </div>
              </div>
              
              <BigChart 
                data={stockHistory?.series || selectedStockData.sparkline}
                type="line"
                color="#3b82f6"
                currency="EGP"
                height={400}
              />
            </>
          )}
        </CardContent>
      </Card>

      {/* Stocks Table */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold">EGX Stocks</h2>
        <div className="space-y-2">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="h-4 w-16 bg-muted rounded" />
                      <div className="h-3 w-32 bg-muted rounded" />
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
            filteredStocks.map((stock) => (
              <Card 
                key={stock.symbol}
                className={cn(
                  "cursor-pointer transition-all hover:shadow-md",
                  selectedStock === stock.symbol && "ring-2 ring-blue-500"
                )}
                onClick={() => setSelectedStock(stock.symbol)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="font-bold text-blue-500">{stock.symbol}</div>
                      <div className="text-sm text-muted-foreground">{stock.name}</div>
                    </div>
                    
                    <div className="text-right space-y-1">
                      <div className="font-semibold">
                        {formatCurrency(stock.last, 'EGP')}
                      </div>
                      <div className={cn(
                        "text-sm font-medium flex items-center gap-1",
                        stock.changePct >= 0 ? 'text-success' : 'text-danger'
                      )}>
                        {stock.changePct >= 0 ? (
                          <TrendingUp className="h-3 w-3" />
                        ) : (
                          <TrendingDown className="h-3 w-3" />
                        )}
                        {stock.changePct >= 0 ? '+' : ''}{stock.changePct.toFixed(2)}%
                      </div>
                      <div className="text-xs text-muted-foreground">
                        Vol: {formatNumber(stock.volume)}
                      </div>
                    </div>
                    
                    <div className="w-24">
                      <MiniSparkline 
                        data={stock.sparkline}
                        color={stock.changePct >= 0 ? '#10b981' : '#ef4444'}
                        height={40}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      {/* Last Updated */}
      {stocksData && (
        <div className="text-center text-sm text-muted-foreground">
          Last updated: {new Date(stocksData.lastUpdated).toLocaleString('en-EG')}
        </div>
      )}
    </div>
  )
}

