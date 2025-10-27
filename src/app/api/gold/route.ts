import { NextRequest, NextResponse } from 'next/server'
import { dataAdapters } from '@/lib/data-adapters'
import { TimeRange } from '@/types'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const base = (searchParams.get('base') as 'EGP' | 'USD') || 'EGP'
    const range = (searchParams.get('range') as TimeRange) || '1D'

    const data = await dataAdapters.getGold({ base, range })
    
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching gold data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch gold data' },
      { status: 500 }
    )
  }
}

