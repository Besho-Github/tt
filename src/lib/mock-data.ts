import { 
  GoldData, 
  SilverData, 
  StocksSummary, 
  ExchangeRates, 
  ConversionResult, 
  NewsArticle, 
  TimeSeriesPoint,
  TimeRange 
} from '@/types'

// Helper function to generate mock time series data
function generateTimeSeries(
  basePrice: number, 
  points: number, 
  volatility: number = 0.02,
  timeRange: TimeRange = '1D'
): TimeSeriesPoint[] {
  const now = new Date()
  const series: TimeSeriesPoint[] = []
  
  let intervalMs: number
  switch (timeRange) {
    case '1D':
      intervalMs = 60 * 60 * 1000 // 1 hour
      break
    case '1W':
      intervalMs = 24 * 60 * 60 * 1000 // 1 day
      break
    case '1M':
      intervalMs = 24 * 60 * 60 * 1000 // 1 day
      break
    case '1Y':
      intervalMs = 7 * 24 * 60 * 60 * 1000 // 1 week
      break
  }

  let currentPrice = basePrice
  
  for (let i = points - 1; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * intervalMs).toISOString()
    
    // Add some random walk
    const change = (Math.random() - 0.5) * volatility * currentPrice
    currentPrice += change
    
    series.push({
      timestamp,
      price: Math.max(0, currentPrice),
      volume: Math.floor(Math.random() * 1000000) + 100000
    })
  }
  
  return series
}

export function getMockGoldData(
  base: 'EGP' | 'USD' = 'EGP',
  range: TimeRange = '1D'
): GoldData {
  const basePrice21K = base === 'EGP' ? 1862.35 : 60.12
  const points = range === '1D' ? 24 : range === '1W' ? 7 : range === '1M' ? 30 : 52
  
  return {
    headline: {
      karat: 21,
      price: basePrice21K,
      changePct: 1.25,
      currency: base
    },
    series: generateTimeSeries(basePrice21K, points, 0.015, range),
    others: [
      {
        karat: 24,
        price: base === 'EGP' ? 2335.60 : 75.42,
        changePct: 0.54,
        seriesMini: generateTimeSeries(base === 'EGP' ? 2335.60 : 75.42, 10, 0.01)
      },
      {
        karat: 18,
        price: base === 'EGP' ? 1550.00 : 50.08,
        changePct: 1.10,
        seriesMini: generateTimeSeries(base === 'EGP' ? 1550.00 : 50.08, 10, 0.01)
      },
      {
        karat: 'ounce' as const,
        price: base === 'EGP' ? 2000.00 : 64.52,
        changePct: 1.70,
        seriesMini: generateTimeSeries(base === 'EGP' ? 2000.00 : 64.52, 10, 0.02)
      }
    ],
    lastUpdated: new Date().toISOString()
  }
}

export function getMockSilverData(
  base: 'EGP' | 'USD' = 'EGP',
  range: TimeRange = '1D'
): SilverData {
  const basePriceGram = base === 'EGP' ? 45.20 : 1.46
  const points = range === '1D' ? 24 : range === '1W' ? 7 : range === '1M' ? 30 : 52
  
  return {
    headline: {
      unit: 'gram',
      price: basePriceGram,
      changePct: 0.85,
      currency: base
    },
    series: generateTimeSeries(basePriceGram, points, 0.02, range),
    others: [
      {
        unit: 'ounce',
        price: base === 'EGP' ? 1405.60 : 45.38,
        changePct: 0.85,
        seriesMini: generateTimeSeries(base === 'EGP' ? 1405.60 : 45.38, 10, 0.02)
      }
    ],
    lastUpdated: new Date().toISOString()
  }
}

export function getMockStocksSummary(): StocksSummary {
  const stocks = [
    { symbol: 'COMI', name: 'Commercial International Bank', basePrice: 85.50 },
    { symbol: 'FWRY', name: 'Fawry for Banking Technology', basePrice: 12.30 },
    { symbol: 'SWDY', name: 'El Sewedy Electric Company', basePrice: 28.75 },
    { symbol: 'EGTS', name: 'Egyptian Transport Services', basePrice: 15.60 },
    { symbol: 'ABUK', name: 'Abu Kir Fertilizers Company', basePrice: 42.20 }
  ]
  
  return {
    defaultSymbol: 'COMI',
    series: generateTimeSeries(85.50, 24, 0.025),
    table: stocks.map(stock => {
      const changePct = (Math.random() - 0.5) * 6 // -3% to +3%
      const currentPrice = stock.basePrice * (1 + changePct / 100)
      
      return {
        symbol: stock.symbol,
        name: stock.name,
        last: currentPrice,
        changePct,
        volume: Math.floor(Math.random() * 5000000) + 100000,
        sparkline: generateTimeSeries(stock.basePrice, 10, 0.02)
      }
    }),
    lastUpdated: new Date().toISOString()
  }
}

export function getMockExchangeRates(base: string = 'EGP'): ExchangeRates {
  const rates: Record<string, number> = {}
  
  if (base === 'EGP') {
    rates.USD = 0.0203 // 1 EGP = 0.0203 USD
    rates.EUR = 0.0186
    rates.GBP = 0.0159
    rates.SAR = 0.0761
  } else if (base === 'USD') {
    rates.EGP = 49.30
    rates.EUR = 0.92
    rates.GBP = 0.78
    rates.SAR = 3.75
  }
  
  return {
    base,
    rates,
    lastUpdated: new Date().toISOString()
  }
}

export function getMockConversion(
  amount: number,
  from: string,
  to: string
): ConversionResult {
  const rates = getMockExchangeRates(from)
  const rate = rates.rates[to] || 1
  
  return {
    amount,
    from,
    to,
    result: amount * rate,
    rate,
    lastUpdated: new Date().toISOString()
  }
}

export function getMockNews(): NewsArticle[] {
  return [
    {
      id: '1',
      title: 'Egyptian Stock Exchange Reaches New Heights',
      summary: 'The EGX30 index closed at record levels driven by strong banking sector performance...',
      source: 'Egypt Today',
      category: 'EGX',
      publishedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      url: 'https://example.com/news/1'
    },
    {
      id: '2',
      title: 'Gold Prices Surge Amid Global Uncertainty',
      summary: 'International gold prices continue their upward trajectory as investors seek safe haven assets...',
      source: 'Financial Times Egypt',
      category: 'Gold/Silver',
      publishedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
      url: 'https://example.com/news/2'
    },
    {
      id: '3',
      title: 'Egyptian Pound Strengthens Against Dollar',
      summary: 'The EGP showed resilience in recent trading sessions, gaining ground against major currencies...',
      source: 'Al Ahram Economics',
      category: 'Currencies',
      publishedAt: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
      url: 'https://example.com/news/3'
    },
    {
      id: '4',
      title: 'Central Bank Announces New Monetary Policy',
      summary: 'The Central Bank of Egypt unveiled new measures to support economic growth and stability...',
      source: 'Reuters Egypt',
      category: 'General',
      publishedAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
      url: 'https://example.com/news/4'
    }
  ]
}

