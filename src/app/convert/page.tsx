"use client"

import { useState, useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ArrowUpDown } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ConversionResult } from '@/types'
import { formatNumber } from '@/lib/utils'

async function fetchConversion(amount: number, from: string, to: string): Promise<ConversionResult> {
  const response = await fetch(`/api/convert?amount=${amount}&from=${from}&to=${to}`)
  if (!response.ok) throw new Error('Failed to fetch conversion')
  return response.json()
}

const currencies = [
  { code: 'EGP', name: 'Egyptian Pound', flag: '🇪🇬' },
  { code: 'USD', name: 'US Dollar', flag: '🇺🇸' },
  { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
  { code: 'GBP', name: 'British Pound', flag: '🇬🇧' },
  { code: 'SAR', name: 'Saudi Riyal', flag: '🇸🇦' },
]

export default function ConvertPage() {
  const searchParams = useSearchParams()
  const [amount, setAmount] = useState(1000)
  const [fromCurrency, setFromCurrency] = useState('EGP')
  const [toCurrency, setToCurrency] = useState('USD')

  // Initialize from URL params
  useEffect(() => {
    const from = searchParams.get('from')
    const to = searchParams.get('to')
    const amt = searchParams.get('amount')
    
    if (from) setFromCurrency(from)
    if (to) setToCurrency(to)
    if (amt) setAmount(parseFloat(amt))
  }, [searchParams])

  const { data: conversionData, isLoading } = useQuery({
    queryKey: ['conversion', amount, fromCurrency, toCurrency],
    queryFn: () => fetchConversion(amount, fromCurrency, toCurrency),
    enabled: amount > 0,
  })

  const handleSwapCurrencies = () => {
    setFromCurrency(toCurrency)
    setToCurrency(fromCurrency)
  }

  const fromCurrencyInfo = currencies.find(c => c.code === fromCurrency)
  const toCurrencyInfo = currencies.find(c => c.code === toCurrency)

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/currencies">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-green-500">Currency Converter</h1>
        </div>
      </div>

      {/* Converter Card */}
      <Card className="max-w-md mx-auto bg-gradient-to-br from-green-500/10 to-green-500/5 border-green-500/20">
        <CardHeader>
          <CardTitle className="text-center text-green-500">Convert Currency</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* You Send */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              You send
            </label>
            <div className="flex gap-2">
              <Input
                type="number"
                value={amount}
                onChange={(e) => setAmount(parseFloat(e.target.value) || 0)}
                className="flex-1"
                min="0"
                step="0.01"
              />
              <select
                value={fromCurrency}
                onChange={(e) => setFromCurrency(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Swap Button */}
          <div className="flex justify-center">
            <Button
              variant="outline"
              size="icon"
              onClick={handleSwapCurrencies}
              className="rounded-full border-green-500/20 hover:bg-green-500/10"
            >
              <ArrowUpDown className="h-4 w-4 text-green-500" />
            </Button>
          </div>

          {/* They Receive */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-muted-foreground">
              They receive
            </label>
            <div className="flex gap-2">
              <div className="flex-1 px-3 py-2 rounded-md border border-input bg-muted/50 text-2xl font-bold text-green-500">
                {isLoading ? (
                  <div className="h-8 bg-muted animate-pulse rounded" />
                ) : conversionData ? (
                  formatNumber(conversionData.result)
                ) : (
                  '0.00'
                )}
              </div>
              <select
                value={toCurrency}
                onChange={(e) => setToCurrency(e.target.value)}
                className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                {currencies.map((currency) => (
                  <option key={currency.code} value={currency.code}>
                    {currency.flag} {currency.code}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Exchange Rate Info */}
          {conversionData && !isLoading && (
            <div className="space-y-2 pt-4 border-t">
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Exchange Rate:</span>
                <span className="font-medium">
                  1 {fromCurrency} = {formatNumber(conversionData.rate)} {toCurrency}
                </span>
              </div>
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Last updated:</span>
                <span>
                  {new Date(conversionData.lastUpdated).toLocaleString('en-EG', {
                    month: 'short',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </span>
              </div>
            </div>
          )}

          {/* Convert Button */}
          <Button 
            className="w-full bg-green-500 hover:bg-green-600"
            disabled={isLoading || amount <= 0}
          >
            {isLoading ? 'Converting...' : 'Convert'}
          </Button>
        </CardContent>
      </Card>

      {/* Popular Conversions */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-center">Popular Conversions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
          {[
            { from: 'USD', to: 'EGP' },
            { from: 'EUR', to: 'EGP' },
            { from: 'GBP', to: 'EGP' },
            { from: 'SAR', to: 'EGP' },
          ].map((pair) => (
            <Button
              key={`${pair.from}-${pair.to}`}
              variant="outline"
              className="h-auto p-3 flex flex-col gap-1"
              onClick={() => {
                setFromCurrency(pair.from)
                setToCurrency(pair.to)
              }}
            >
              <div className="text-sm font-medium">
                {pair.from} → {pair.to}
              </div>
              <div className="text-xs text-muted-foreground">
                {currencies.find(c => c.code === pair.from)?.flag} to{' '}
                {currencies.find(c => c.code === pair.to)?.flag}
              </div>
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

