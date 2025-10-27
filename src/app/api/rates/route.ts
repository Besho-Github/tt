import { NextRequest, NextResponse } from 'next/server'
import { dataAdapters } from '@/lib/data-adapters'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const base = searchParams.get('base') || 'EGP'
    const symbols = searchParams.get('symbols')?.split(',')

    const data = await dataAdapters.getRates({ base, symbols })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching exchange rates:', error)
    return NextResponse.json(
      { error: 'Failed to fetch exchange rates' },
      { status: 500 }
    )
  }
}

