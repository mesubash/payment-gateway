"use client"

import { useRouter } from "next/navigation"
import { usePaymentStore, type Package } from "@/lib/store"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, ArrowRight, Mountain, Clock, Shield, Users, ArrowLeft } from "lucide-react"

const HGN_PACKAGES: Package[] = [
  {
    id: "basic",
    name: "Basic Guardian",
    description: "Essential protection for trekkers",
    price: 89,
    duration: "14 days",
    tier: "basic",
    altitudeLimit: "≤3,500m",
    highlights: [
      "Emergency medical coverage",
      "Helicopter evacuation",
      "24/7 helpline support",
      "Equipment insurance"
    ],
    includes: [
      "Personal accident insurance",
      "Trip cancellation cover",
      "Lost luggage protection",
      "Basic device protection"
    ]
  },
  {
    id: "plus",
    name: "Plus Guardian",
    description: "Enhanced coverage for serious adventurers",
    price: 189,
    duration: "28 days",
    tier: "plus",
    altitudeLimit: "≤5,500m",
    highlights: [
      "Comprehensive medical coverage",
      "Priority helicopter evacuation",
      "Expedition equipment cover",
      "Extended duration"
    ],
    includes: [
      "High-altitude medical insurance",
      "Advanced rescue services",
      "Full equipment replacement",
      "Premium device protection"
    ]
  },
  {
    id: "pro",
    name: "Pro Guardian",
    description: "Ultimate protection for extreme expeditions",
    price: 349,
    duration: "60 days",
    tier: "pro",
    altitudeLimit: "≤6,000m+",
    highlights: [
      "Platinum medical coverage",
      "Unlimited evacuation services",
      "Expedition support team",
      "Satellite communication"
    ],
    includes: [
      "Extreme altitude coverage",
      "24/7 dedicated support team",
      "Full expedition insurance",
      "Elite device protection",
      "Satellite phone included"
    ]
  },
]

export default function SelectPlanPage() {
  const router = useRouter()
  const { bookingDetails, setSelectedPackage } = usePaymentStore()

  // Check if running in browser before redirecting
  if (typeof window !== 'undefined' && !bookingDetails.tripDetails.numberOfTravellers) {
    router.push("/trip-details")
    return null
  }

  // Return null during SSR if no trip details
  if (!bookingDetails.tripDetails.numberOfTravellers) {
    return null
  }

  const numberOfTravellers = bookingDetails.tripDetails.numberOfTravellers

  const tierConfig = {
    basic: {
      gradient: "from-slate-600 via-slate-700 to-slate-800",
      badge: "bg-slate-100 text-slate-900 border-slate-200",
      button: "bg-slate-700 hover:bg-slate-800",
      popular: false,
    },
    plus: {
      gradient: "from-blue-600 via-blue-700 to-blue-800",
      badge: "bg-blue-100 text-blue-900 border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700",
      popular: true,
    },
    pro: {
      gradient: "from-amber-600 via-amber-700 to-amber-800",
      badge: "bg-amber-100 text-amber-900 border-amber-200",
      button: "bg-amber-600 hover:bg-amber-700",
      popular: false,
    },
  }

  const handleSelectPlan = (pkg: Package) => {
    setSelectedPackage(pkg)
    router.push("/details")
  }

  const handleBack = () => {
    router.push("/trip-details")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Button
            variant="ghost"
            onClick={handleBack}
            className="mb-4 gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Trip Details
          </Button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Select Your Plan</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Choose the protection plan that matches your adventure
            </p>
          </div>
        </motion.div>

        {/* Trip Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-8 border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-foreground">Your Trip</h3>
              </div>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div>
                  <p className="text-muted-foreground">Travellers</p>
                  <p className="font-semibold">{numberOfTravellers} {numberOfTravellers === 1 ? 'Person' : 'People'}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Route</p>
                  <p className="font-semibold">{bookingDetails.tripDetails.travellingFrom} → {bookingDetails.tripDetails.travellingTo}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Adventure</p>
                  <p className="font-semibold">{bookingDetails.tripDetails.adventure}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Plans Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
          {HGN_PACKAGES.map((pkg, index) => {
            const config = tierConfig[pkg.tier]
            const totalPrice = pkg.price * numberOfTravellers

            return (
              <motion.div
                key={pkg.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className={`relative rounded-2xl border-2 overflow-hidden bg-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 ${
                  config.popular ? "border-primary shadow-lg shadow-primary/5" : "border-border"
                }`}
              >
                {/* Popular Badge */}
                {config.popular && (
                  <div className="absolute -top-1 -right-1 z-20">
                    <div className="bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold uppercase tracking-wide flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Most Popular
                    </div>
                  </div>
                )}

                {/* Altitude Header */}
                <div className={`relative bg-linear-to-br ${config.gradient} p-8 text-white overflow-hidden`}>
                  <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
                  <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
                  
                  <div className="relative z-10">
                    <Badge variant="outline" className={`${config.badge} border mb-4`}>
                      {pkg.tier.toUpperCase()} PLAN
                    </Badge>
                    
                    <div className="flex items-end gap-3 mb-2">
                      <Mountain className="w-8 h-8 opacity-80" />
                      <div className="text-5xl font-bold">{pkg.altitudeLimit}</div>
                    </div>
                    <div className="text-sm opacity-90 flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      {pkg.duration} coverage
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  <div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{pkg.description}</p>
                  </div>

                  {/* Features */}
                  <div className="space-y-3">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Includes:</p>
                    {pkg.includes.map((feature, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className="mt-0.5 p-1 bg-primary/10 rounded-full">
                          <Check className="w-3 h-3 text-primary" />
                        </div>
                        <span className="text-sm text-foreground/90 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="pt-6 border-t border-border space-y-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">Price per person</p>
                      <p className="text-2xl font-bold text-foreground">${pkg.price} <span className="text-sm font-normal text-muted-foreground">USD</span></p>
                    </div>
                    
                    <div className="bg-primary/5 rounded-lg p-4">
                      <p className="text-xs text-muted-foreground mb-1">Total for {numberOfTravellers} {numberOfTravellers === 1 ? 'traveller' : 'travellers'}</p>
                      <p className="text-3xl font-bold text-primary">${totalPrice} <span className="text-sm font-normal">USD</span></p>
                    </div>

                    {/* CTA Button */}
                    <Button
                      onClick={() => handleSelectPlan(pkg)}
                      className={`w-full ${config.button} text-white font-semibold py-6 rounded-xl transition-all duration-300 group`}
                      size="lg"
                    >
                      <span>Select Plan</span>
                      <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
