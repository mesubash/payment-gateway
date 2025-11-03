"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Package, UserInfo, BookingDetails } from "@/lib/store"
import { Shield, Clock, Mountain, User, CreditCard, CheckCircle2 } from "lucide-react"

interface BookingSummaryProps {
  package: Package
  userInfo: UserInfo
  bookingDetails: BookingDetails
}

export function BookingSummary({ package: pkg, userInfo, bookingDetails }: BookingSummaryProps) {
  const numberOfTravellers = bookingDetails.tripDetails?.numberOfTravellers || 1
  const total = pkg.price * numberOfTravellers

  return (
    <Card className="border-2 shadow-xl bg-linear-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <CardContent className="p-6">
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
            <Shield className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold">Booking Summary</h3>
            <p className="text-xs text-muted-foreground">Review your selection</p>
          </div>
        </div>

        {/* Package Card */}
        <div className="bg-white dark:bg-slate-950 rounded-lg p-4 mb-6 shadow-sm border border-border">
          <div className="flex items-start justify-between mb-3">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Plan</p>
              <p className="font-bold text-lg">{pkg.name}</p>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-xs font-semibold px-2 py-1 rounded">
              {pkg.tier.toUpperCase()}
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-muted-foreground">{pkg.duration}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Mountain className="w-3.5 h-3.5 text-blue-600" />
              <span className="text-muted-foreground">≤{pkg.altitudeLimit}</span>
            </div>
          </div>
        </div>

        {/* Traveller Count */}
        <div className="bg-white dark:bg-slate-950 rounded-lg p-4 mb-6 shadow-sm border border-border">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Travellers</p>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <User className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <p className="font-semibold">{numberOfTravellers} {numberOfTravellers === 1 ? 'Person' : 'People'}</p>
              {bookingDetails.travellers?.length > 0 && (
                <p className="text-xs text-muted-foreground">
                  {bookingDetails.travellers[0].fullName || 'Primary traveller'}
                  {numberOfTravellers > 1 && ` +${numberOfTravellers - 1} more`}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Package Features */}
        <div className="mb-6">
          <p className="text-xs text-muted-foreground uppercase tracking-wider mb-3">Included</p>
          <div className="space-y-2">
            {pkg.includes.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="w-4 h-4 text-green-600 mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Price Section */}
        <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-xl p-5 mb-4">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-medium opacity-90">Total Amount</span>
            <CreditCard className="w-5 h-5 opacity-75" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-bold">${total}</span>
            <span className="text-sm opacity-75">USD</span>
          </div>
          {numberOfTravellers > 1 && (
            <p className="text-xs opacity-75 mt-1">
              ${pkg.price} × {numberOfTravellers} travellers
            </p>
          )}
          <p className="text-xs opacity-75 mt-2">One-time payment • No hidden fees</p>
        </div>

        {/* Security Badges */}
        <div className="space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950 rounded-lg py-2">
            <Shield className="w-3.5 h-3.5" />
            <span className="font-medium">256-bit SSL Encrypted</span>
          </div>
          <p className="text-center text-xs text-muted-foreground">
            Your information is safe and secure
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
