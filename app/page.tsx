"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePaymentStore, type Package } from "@/lib/store"
import { PackageCard } from "@/components/package-card"
import { motion } from "framer-motion"
import { MapPin, Shield, Mountain } from "lucide-react"

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

const STEP_LABELS = ["Select Package", "Your Details", "Payment", "Confirmation"]

export default function Home() {
  const router = useRouter()
  const { setSelectedPackage } = usePaymentStore()

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg)
    router.push("/details")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-60 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="pt-12 pb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mountain className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Himalayan Guardian</h2>
                <p className="text-xs text-muted-foreground">www.hgn.com.np</p>
              </div>
            </div>
          </div>

          {/* Hero Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center py-16 md:py-24"
          >
            <motion.div
              initial={{ scale: 0.95 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8"
            >
              <Shield className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Trusted by 10,000+ Adventurers</span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground mb-6 leading-tight">
              Your Trusted Guardian
              <br />
              <span className="text-primary">in the Himalayas</span>
            </h1>

            <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
              Comprehensive insurance and 24/7 support for trekkers and mountaineers. 
              Choose protection that matches your adventure.
            </p>

            {/* Quick Stats */}
            <div className="flex flex-wrap justify-center gap-8 md:gap-12 mb-16">
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">6,000m+</div>
                <div className="text-sm text-muted-foreground">Max Altitude</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">24/7</div>
                <div className="text-sm text-muted-foreground">Emergency Support</div>
              </div>
              <div className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-foreground mb-1">60 Days</div>
                <div className="text-sm text-muted-foreground">Max Coverage</div>
              </div>
            </div>
          </motion.div>

          {/* Package Selection */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="pb-20"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                Choose Your Protection Plan
              </h2>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Select the package that best fits your adventure. All plans include emergency evacuation and 24/7 support.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {HGN_PACKAGES.map((pkg, index) => (
                <PackageCard key={pkg.id} package={pkg} onSelect={handleSelectPackage} index={index} />
              ))}
            </div>
          </motion.div>

          {/* Features Section */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="pb-20"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-8 hover:border-primary/50 transition-colors">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                  <Shield className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Complete Protection</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Medical coverage, emergency evacuation, equipment insurance, and personal accident protection included.
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-8 hover:border-primary/50 transition-colors">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                  <Mountain className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">High Altitude Ready</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Specialized coverage for extreme altitudes up to 6,000m+ with professional rescue services.
                </p>
              </div>

              <div className="bg-card/50 backdrop-blur-sm rounded-2xl border border-border p-8 hover:border-primary/50 transition-colors">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-primary/10 mb-6">
                  <MapPin className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Always Connected</h3>
                <p className="text-muted-foreground leading-relaxed">
                  24/7 emergency hotline, satellite phone support (Pro plan), and dedicated coordination team.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
