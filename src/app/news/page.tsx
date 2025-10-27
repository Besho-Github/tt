"use client"

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { ArrowLeft, ExternalLink, Filter } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { NewsArticle } from '@/types'
import { cn } from '@/lib/utils'

async function fetchNews(): Promise<NewsArticle[]> {
  const response = await fetch('/api/news')
  if (!response.ok) throw new Error('Failed to fetch news')
  return response.json()
}

const categories = [
  { value: 'all', label: 'All News' },
  { value: 'EGX', label: 'EGX' },
  { value: 'Currencies', label: 'Currencies' },
  { value: 'Gold/Silver', label: 'Gold/Silver' },
  { value: 'General', label: 'General' },
]

const categoryColors = {
  'EGX': 'bg-blue-500/10 text-blue-500 border-blue-500/20',
  'Currencies': 'bg-green-500/10 text-green-500 border-green-500/20',
  'Gold/Silver': 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
  'General': 'bg-gray-500/10 text-gray-500 border-gray-500/20',
}

export default function NewsPage() {
  const [selectedCategory, setSelectedCategory] = useState('all')

  const { data: newsData, isLoading } = useQuery({
    queryKey: ['news'],
    queryFn: fetchNews,
  })

  const filteredNews = newsData?.filter(article => 
    selectedCategory === 'all' || article.category === selectedCategory
  ) || []

  const formatTimeAgo = (dateString: string) => {
    const now = new Date()
    const date = new Date(dateString)
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 1) return 'Just now'
    if (diffInHours < 24) return `${diffInHours}h ago`
    
    const diffInDays = Math.floor(diffInHours / 24)
    if (diffInDays < 7) return `${diffInDays}d ago`
    
    return date.toLocaleDateString('en-EG', { 
      month: 'short', 
      day: 'numeric' 
    })
  }

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold">Financial News</h1>
        </div>
      </div>

      {/* Category Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((category) => (
          <Button
            key={category.value}
            variant={selectedCategory === category.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(category.value)}
            className="whitespace-nowrap"
          >
            <Filter className="h-3 w-3 mr-1" />
            {category.label}
          </Button>
        ))}
      </div>

      {/* News Articles */}
      <div className="space-y-4">
        {isLoading ? (
          Array.from({ length: 4 }).map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <div className="h-4 w-16 bg-muted rounded" />
                    <div className="h-4 w-20 bg-muted rounded" />
                  </div>
                  <div className="h-6 bg-muted rounded" />
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))
        ) : filteredNews.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <div className="text-muted-foreground">
                No news articles found for the selected category.
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredNews.map((article) => (
            <Card 
              key={article.id} 
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => article.url && window.open(article.url, '_blank')}
            >
              <CardContent className="p-6">
                <div className="space-y-3">
                  {/* Category and Time */}
                  <div className="flex items-center gap-2 text-sm">
                    <span className={cn(
                      "px-2 py-1 rounded-full text-xs font-medium border",
                      categoryColors[article.category as keyof typeof categoryColors] || categoryColors.General
                    )}>
                      {article.category}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">
                      {formatTimeAgo(article.publishedAt)}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground">{article.source}</span>
                  </div>

                  {/* Title */}
                  <h3 className="text-lg font-semibold leading-tight hover:text-primary transition-colors">
                    {article.title}
                  </h3>

                  {/* Summary */}
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {article.summary}
                  </p>

                  {/* Read More Link */}
                  {article.url && (
                    <div className="flex items-center gap-1 text-primary text-sm font-medium">
                      <span>Read full article</span>
                      <ExternalLink className="h-3 w-3" />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Load More */}
      {filteredNews.length > 0 && (
        <div className="text-center">
          <Button variant="outline" className="w-full max-w-sm">
            Load More Articles
          </Button>
        </div>
      )}
    </div>
  )
}

