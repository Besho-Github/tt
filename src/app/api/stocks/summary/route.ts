import { NextResponse } from 'next/server'
import { dataAdapters } from '@/lib/data-adapters'

export async function GET() {
  try {
    const data = await dataAdapters.getStocksSummary()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching stocks summary:', error)
    return NextResponse.json(
      { error: 'Failed to fetch stocks summary' },
      { status: 500 }
    )
  }
}

