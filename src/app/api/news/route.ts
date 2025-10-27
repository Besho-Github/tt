import { NextResponse } from 'next/server'
import { dataAdapters } from '@/lib/data-adapters'

export async function GET() {
  try {
    const data = await dataAdapters.getNews()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching news:', error)
    return NextResponse.json(
      { error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

