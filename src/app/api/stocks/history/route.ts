import { NextRequest, NextResponse } from 'next/server'
import { dataAdapters } from '@/lib/data-adapters'
import { TimeRange } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const symbol = searchParams.get('symbol')
    const range = (searchParams.get('range') as TimeRange) || '1D'

    if (!symbol) {
      return NextResponse.json(
        { error: 'Symbol parameter is required' },
        { status: 400 }
      )
    }

    const data = await dataAdapters.getStockHistory({ symbol, range })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching stock history:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stock history' },
      { status: 500 }
    )
  }
}

