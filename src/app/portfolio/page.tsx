"use client"

import { ArrowLeft, Star, TrendingUp, Bell, Eye } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function PortfolioPage() {
  const features = [
    {
      icon: Eye,
      title: 'Watchlist',
      description: 'Track your favorite stocks, gold, and currency pairs'
    },
    {
      icon: Bell,
      title: 'Price Alerts',
      description: 'Get notified when prices hit your target levels'
    },
    {
      icon: TrendingUp,
      title: 'P&L Tracking',
      description: 'Monitor your portfolio performance and gains/losses'
    },
    {
      icon: Star,
      title: 'Advanced Analytics',
      description: 'Detailed charts and technical indicators'
    }
  ]

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
          <h1 className="text-3xl font-bold">Portfolio</h1>
        </div>
      </div>

      {/* Subscription Gate */}
      <div className="max-w-2xl mx-auto">
        <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/20">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl text-primary">
              Unlock Your Portfolio Insights
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center text-muted-foreground">
              Subscribe to access advanced portfolio management features and take control of your investments.
            </div>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {features.map((feature) => (
                <div key={feature.title} className="flex gap-3 p-4 rounded-lg bg-card/50">
                  <feature.icon className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div className="space-y-1">
                    <div className="font-semibold">{feature.title}</div>
                    <div className="text-sm text-muted-foreground">
                      {feature.description}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="text-center space-y-4">
              <div className="space-y-2">
                <div className="text-3xl font-bold text-primary">
                  199 EGP
                  <span className="text-lg font-normal text-muted-foreground">/month</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  Cancel anytime • 7-day free trial
                </div>
              </div>

              <Button size="lg" className="w-full max-w-sm">
                Start Free Trial
              </Button>

              <div className="text-xs text-muted-foreground">
                By subscribing, you agree to our Terms of Service and Privacy Policy
              </div>
            </div>

            {/* Benefits */}
            <div className="border-t pt-6">
              <div className="text-center space-y-2">
                <div className="font-semibold">What you'll get:</div>
                <div className="text-sm text-muted-foreground space-y-1">
                  <div>✓ Unlimited watchlist items</div>
                  <div>✓ Real-time price alerts via email & push notifications</div>
                  <div>✓ Portfolio performance analytics</div>
                  <div>✓ Advanced charting tools</div>
                  <div>✓ Export data to Excel/CSV</div>
                  <div>✓ Priority customer support</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Testimonials */}
      <div className="max-w-4xl mx-auto space-y-6">
        <h2 className="text-xl font-semibold text-center">What Our Users Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            {
              name: 'Ahmed Hassan',
              role: 'Day Trader',
              comment: 'The portfolio tracking has helped me make better investment decisions.',
              rating: 5
            },
            {
              name: 'Fatima Ali',
              role: 'Gold Investor',
              comment: 'Price alerts keep me informed about gold market movements instantly.',
              rating: 5
            },
            {
              name: 'Mohamed Saeed',
              role: 'Currency Trader',
              comment: 'Best financial app for Egyptian market. Highly recommended!',
              rating: 5
            }
          ].map((testimonial) => (
            <Card key={testimonial.name} className="bg-muted/50">
              <CardContent className="p-4 space-y-3">
                <div className="flex gap-1">
                  {Array.from({ length: testimonial.rating }).map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <div className="text-sm italic">"{testimonial.comment}"</div>
                <div className="space-y-1">
                  <div className="font-semibold text-sm">{testimonial.name}</div>
                  <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

