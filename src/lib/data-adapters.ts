import { 
  GoldData, 
  SilverData, 
  StocksSummary, 
  ExchangeRates, 
  ConversionResult, 
  NewsArticle,
  TimeRange 
} from '@/types'
import {
  getMockGoldData,
  getMockSilverData,
  getMockStocksSummary,
  getMockExchangeRates,
  getMockConversion,
  getMockNews
} from './mock-data'

const USE_MOCK = process.env.USE_MOCK !== 'false'

export interface DataAdapters {
  getGold: (params: { base?: 'EGP' | 'USD'; range?: TimeRange }) => Promise<GoldData>
  getSilver: (params: { base?: 'EGP' | 'USD'; range?: TimeRange }) => Promise<SilverData>
  getStocksSummary: () => Promise<StocksSummary>
  getStockHistory: (params: { symbol: string; range?: TimeRange }) => Promise<{ series: any[] }>
  getRates: (params: { base?: string; symbols?: string[] }) => Promise<ExchangeRates>
  convert: (params: { amount: number; from: string; to: string }) => Promise<ConversionResult>
  getNews: () => Promise<NewsArticle[]>
}

// Mock implementations
const mockAdapters: DataAdapters = {
  async getGold({ base = 'EGP', range = '1D' }) {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 100))
    return getMockGoldData(base, range)
  },

  async getSilver({ base = 'EGP', range = '1D' }) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return getMockSilverData(base, range)
  },

  async getStocksSummary() {
    await new Promise(resolve => setTimeout(resolve, 150))
    return getMockStocksSummary()
  },

  async getStockHistory({ symbol, range = '1D' }) {
    await new Promise(resolve => setTimeout(resolve, 100))
    const summary = getMockStocksSummary()
    const stock = summary.table.find(s => s.symbol === symbol)
    
    if (!stock) {
      throw new Error(`Stock ${symbol} not found`)
    }

    // Generate longer series for the specific stock
    const points = range === '1D' ? 24 : range === '1W' ? 7 : range === '1M' ? 30 : 52
    return {
      series: stock.sparkline.slice(0, points)
    }
  },

  async getRates({ base = 'EGP' }) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return getMockExchangeRates(base)
  },

  async convert({ amount, from, to }) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return getMockConversion(amount, from, to)
  },

  async getNews() {
    await new Promise(resolve => setTimeout(resolve, 100))
    return getMockNews()
  }
}

// Real implementations (placeholder for future)
const realAdapters: DataAdapters = {
  async getGold({ base = 'EGP', range = '1D' }) {
    // TODO: Implement real API calls
    return getMockGoldData(base, range)
  },

  async getSilver({ base = 'EGP', range = '1D' }) {
    // TODO: Implement real API calls
    return getMockSilverData(base, range)
  },

  async getStocksSummary() {
    // TODO: Implement real API calls
    return getMockStocksSummary()
  },

  async getStockHistory({ symbol, range = '1D' }) {
    // TODO: Implement real API calls
    const summary = getMockStocksSummary()
    const stock = summary.table.find(s => s.symbol === symbol)
    
    if (!stock) {
      throw new Error(`Stock ${symbol} not found`)
    }

    return {
      series: stock.sparkline
    }
  },

  async getRates({ base = 'EGP' }) {
    try {
      // Use exchangerate.host API for real rates
      const response = await fetch(`https://api.exchangerate.host/latest?base=${base}`)
      const data = await response.json()
      
      return {
        base: data.base,
        rates: data.rates,
        lastUpdated: data.date
      }
    } catch (error) {
      console.warn('Failed to fetch real exchange rates, falling back to mock:', error)
      return getMockExchangeRates(base)
    }
  },

  async convert({ amount, from, to }) {
    try {
      const response = await fetch(
        `https://api.exchangerate.host/convert?from=${from}&to=${to}&amount=${amount}`
      )
      const data = await response.json()
      
      return {
        amount,
        from,
        to,
        result: data.result,
        rate: data.info.rate,
        lastUpdated: data.date
      }
    } catch (error) {
      console.warn('Failed to fetch real conversion, falling back to mock:', error)
      return getMockConversion(amount, from, to)
    }
  },

  async getNews() {
    // TODO: Implement real news API
    return getMockNews()
  }
}

export const dataAdapters = USE_MOCK ? mockAdapters : realAdapters

