"use client"

import { useState, useEffect } from 'react'
import { ArrowLeft, User, Camera, Save } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { UserProfile } from '@/types'
import { cn } from '@/lib/utils'

const defaultProfile: UserProfile = {
  name: 'Ahmed Hassan',
  avatar: undefined,
  preferences: {
    theme: 'dark',
    currency: 'EGP',
    language: 'en',
    rtl: false
  }
}

export default function SettingsPage() {
  const [profile, setProfile] = useState<UserProfile>(defaultProfile)
  const [isLoading, setIsLoading] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  // Load profile from localStorage on mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('userProfile')
    if (savedProfile) {
      try {
        setProfile(JSON.parse(savedProfile))
      } catch (error) {
        console.error('Failed to parse saved profile:', error)
      }
    }
  }, [])

  const handleSave = async () => {
    setIsLoading(true)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Save to localStorage
    localStorage.setItem('userProfile', JSON.stringify(profile))
    
    // Apply RTL if enabled
    document.documentElement.dir = profile.preferences.rtl ? 'rtl' : 'ltr'
    
    setIsLoading(false)
    setIsSaved(true)
    
    // Reset saved state after 2 seconds
    setTimeout(() => setIsSaved(false), 2000)
  }

  const updateProfile = (updates: Partial<UserProfile>) => {
    setProfile(prev => ({ ...prev, ...updates }))
  }

  const updatePreferences = (updates: Partial<UserProfile['preferences']>) => {
    setProfile(prev => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates }
    }))
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
          <h1 className="text-3xl font-bold">Settings</h1>
        </div>
        <Button 
          onClick={handleSave}
          disabled={isLoading}
          className={cn(
            "transition-all",
            isSaved && "bg-success hover:bg-success"
          )}
        >
          {isLoading ? (
            'Saving...'
          ) : isSaved ? (
            'Saved!'
          ) : (
            <>
              <Save className="h-4 w-4 mr-2" />
              Save
            </>
          )}
        </Button>
      </div>

      <div className="max-w-2xl mx-auto space-y-6">
        {/* Profile Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              Profile
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Avatar */}
            <div className="flex items-center gap-4">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-2xl font-bold text-primary">
                  {profile.avatar ? (
                    <img 
                      src={profile.avatar} 
                      alt="Avatar" 
                      className="w-full h-full rounded-full object-cover"
                    />
                  ) : (
                    profile.name.charAt(0).toUpperCase()
                  )}
                </div>
                <Button
                  size="icon"
                  variant="outline"
                  className="absolute -bottom-1 -right-1 h-8 w-8 rounded-full"
                  onClick={() => {
                    // In a real app, this would open a file picker
                    const avatarUrl = prompt('Enter avatar URL (or leave empty to remove):')
                    if (avatarUrl !== null) {
                      updateProfile({ avatar: avatarUrl || undefined })
                    }
                  }}
                >
                  <Camera className="h-3 w-3" />
                </Button>
              </div>
              <div className="flex-1">
                <div className="text-sm text-muted-foreground mb-1">Profile Picture</div>
                <div className="text-sm text-muted-foreground">
                  Click the camera icon to change your avatar
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium">Full Name</label>
              <Input
                value={profile.name}
                onChange={(e) => updateProfile({ name: e.target.value })}
                placeholder="Enter your full name"
              />
            </div>
          </CardContent>
        </Card>

        {/* Preferences Section */}
        <Card>
          <CardHeader>
            <CardTitle>Preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Theme */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Theme</label>
              <div className="flex gap-2">
                {[
                  { value: 'dark', label: 'Dark' },
                  { value: 'light', label: 'Light' }
                ].map((theme) => (
                  <Button
                    key={theme.value}
                    variant={profile.preferences.theme === theme.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updatePreferences({ theme: theme.value as 'dark' | 'light' })}
                  >
                    {theme.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Default Currency */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Default Currency</label>
              <div className="flex gap-2">
                {[
                  { value: 'EGP', label: '🇪🇬 EGP' },
                  { value: 'USD', label: '🇺🇸 USD' }
                ].map((currency) => (
                  <Button
                    key={currency.value}
                    variant={profile.preferences.currency === currency.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updatePreferences({ currency: currency.value as 'EGP' | 'USD' })}
                  >
                    {currency.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* Language */}
            <div className="space-y-3">
              <label className="text-sm font-medium">Language</label>
              <div className="flex gap-2">
                {[
                  { value: 'en', label: 'English' },
                  { value: 'ar', label: 'العربية' }
                ].map((language) => (
                  <Button
                    key={language.value}
                    variant={profile.preferences.language === language.value ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => updatePreferences({ language: language.value as 'en' | 'ar' })}
                  >
                    {language.label}
                  </Button>
                ))}
              </div>
            </div>

            {/* RTL Support */}
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="text-sm font-medium">Right-to-Left (RTL)</div>
                <div className="text-xs text-muted-foreground">
                  Enable RTL layout for Arabic text
                </div>
              </div>
              <Button
                variant={profile.preferences.rtl ? 'default' : 'outline'}
                size="sm"
                onClick={() => updatePreferences({ rtl: !profile.preferences.rtl })}
              >
                {profile.preferences.rtl ? 'Enabled' : 'Disabled'}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card>
          <CardHeader>
            <CardTitle>About</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">App Version</span>
              <span>1.0.0</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Last Updated</span>
              <span>{new Date().toLocaleDateString('en-EG')}</span>
            </div>
            <div className="pt-4 border-t">
              <div className="text-center text-sm text-muted-foreground">
                Egyptian Finance App © 2024
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

