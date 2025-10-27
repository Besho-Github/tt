export interface PriceData {
  price: number
  changePct: number
  changeAbs?: number
  timestamp: string
}

export interface TimeSeriesPoint {
  timestamp: string
  price: number
  volume?: number
}

export interface GoldData {
  headline: {
    karat: number
    price: number
    changePct: number
    currency: 'EGP' | 'USD'
  }
  series: TimeSeriesPoint[]
  others: Array<{
    karat: number | 'ounce'
    price: number
    changePct: number
    seriesMini: TimeSeriesPoint[]
  }>
  lastUpdated: string
}

export interface SilverData {
  headline: {
    unit: 'gram' | 'ounce'
    price: number
    changePct: number
    currency: 'EGP' | 'USD'
  }
  series: TimeSeriesPoint[]
  others: Array<{
    unit: 'gram' | 'ounce'
    price: number
    changePct: number
    seriesMini: TimeSeriesPoint[]
  }>
  lastUpdated: string
}

export interface StockData {
  symbol: string
  name: string
  last: number
  changePct: number
  volume: number
  sparkline: TimeSeriesPoint[]
}

export interface StocksSummary {
  defaultSymbol: string
  series: TimeSeriesPoint[]
  table: StockData[]
  lastUpdated: string
}

export interface ExchangeRates {
  base: string
  rates: Record<string, number>
  lastUpdated: string
}

export interface ConversionResult {
  amount: number
  from: string
  to: string
  result: number
  rate: number
  lastUpdated: string
}

export interface NewsArticle {
  id: string
  title: string
  summary: string
  source: string
  category: 'EGX' | 'Currencies' | 'Gold/Silver' | 'General'
  publishedAt: string
  url?: string
}

export interface UserProfile {
  name: string
  avatar?: string
  preferences: {
    theme: 'dark' | 'light'
    currency: 'EGP' | 'USD'
    language: 'en' | 'ar'
    rtl: boolean
  }
}

export type TimeRange = '1D' | '1W' | '1M' | '1Y'
export type Currency = 'EGP' | 'USD' | 'EUR' | 'GBP' | 'SAR'

