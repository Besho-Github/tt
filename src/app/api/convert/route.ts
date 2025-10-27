import { NextRequest, NextResponse } from 'next/server'
import { dataAdapters } from '@/lib/data-adapters'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const amount = parseFloat(searchParams.get('amount') || '1')
    const from = searchParams.get('from') || 'EGP'
    const to = searchParams.get('to') || 'USD'

    if (isNaN(amount)) {
      return NextResponse.json(
        { error: 'Invalid amount parameter' },
        { status: 400 }
      )
    }

    const data = await dataAdapters.convert({ amount, from, to })
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error converting currency:', error)
    return NextResponse.json(
      { error: 'Failed to convert currency' },
      { status: 500 }
    )
  }
}

