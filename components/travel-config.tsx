"use client"

import { useState } from "react"
import { usePaymentStore } from "@/lib/store"
import { Calendar, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

interface TravelConfigProps {
  onComplete: () => void
}

const TIERS = [
  {
    id: "standard",
    name: "Standard",
    description: "Essential comfort",
    icon: "✓",
  },
  {
    id: "premium",
    name: "Premium",
    description: "Enhanced experience",
    icon: "✦",
    badge: "Recommended",
  },
  {
    id: "luxury",
    name: "Luxury",
    description: "Ultimate indulgence",
    icon: "♔",
  },
]

const DESTINATIONS = [
  { name: "Mediterranean Coast", icon: "🌊" },
  { name: "Tokyo & Kyoto", icon: "🗾" },
  { name: "African Safari", icon: "🦁" },
  { name: "Paris & French Riviera", icon: "🗼" },
  { name: "Caribbean Islands", icon: "🏝️" },
  { name: "Swiss Alps", icon: "⛰️" },
  { name: "Maldives", icon: "🌴" },
  { name: "Iceland", icon: "❄️" },
]

export function TravelConfig({ onComplete }: TravelConfigProps) {
  const { travelOptions, setTravelOptions } = usePaymentStore()
  const [step, setStep] = useState(0)

  const handleDestinationSelect = (destination: string) => {
    setTravelOptions({ ...travelOptions, destination })
    setStep(1)
  }

  const handleDateChange = (type: "start" | "end", date: string) => {
    setTravelOptions({
      ...travelOptions,
      [type === "start" ? "startDate" : "endDate"]: date,
    })
  }

  const handleTravelersChange = (type: "adults" | "children", value: number) => {
    setTravelOptions({
      ...travelOptions,
      travelers: {
        ...travelOptions.travelers,
        [type]: Math.max(0, value),
      },
    })
  }

  const handleTierSelect = (tier: "standard" | "premium" | "luxury") => {
    setTravelOptions({ ...travelOptions, tier })
  }

  const canProceed =
    travelOptions.destination &&
    travelOptions.startDate &&
    travelOptions.endDate &&
    travelOptions.tier &&
    new Date(travelOptions.startDate) < new Date(travelOptions.endDate)

  return (
    <div className="space-y-8">
      {/* Destination Selection */}
      {step >= 0 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-sm font-bold">
              1
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Select Destination</h3>
              <p className="text-sm text-muted-foreground">Choose your ideal travel destination</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {DESTINATIONS.map((dest) => (
              <button
                key={dest.name}
                onClick={() => handleDestinationSelect(dest.name)}
                className={`p-4 text-left rounded-xl border-2 transition-all group ${
                  travelOptions.destination === dest.name
                    ? "border-blue-600 bg-blue-50 shadow-md"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                <p className="text-2xl mb-2">{dest.icon}</p>
                <p className="font-semibold text-foreground text-sm leading-tight">{dest.name}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      {/* Dates Selection */}
      {step >= 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-sm font-bold">
              2
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Travel Dates</h3>
              <p className="text-sm text-muted-foreground">When would you like to travel?</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                Start Date
              </label>
              <input
                type="date"
                value={travelOptions.startDate}
                onChange={(e) => handleDateChange("start", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-foreground focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                End Date
              </label>
              <input
                type="date"
                value={travelOptions.endDate}
                onChange={(e) => handleDateChange("end", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 bg-white text-foreground focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* Travelers Selection */}
      {step >= 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-sm font-bold">
              3
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Travelers</h3>
              <p className="text-sm text-muted-foreground">How many people are traveling?</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <label className="text-sm font-semibold text-foreground flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-600" />
                Adults
              </label>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleTravelersChange("adults", travelOptions.travelers.adults - 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-white transition-all font-semibold text-foreground"
                >
                  −
                </button>
                <span className="text-2xl font-light text-foreground">{travelOptions.travelers.adults}</span>
                <button
                  onClick={() => handleTravelersChange("adults", travelOptions.travelers.adults + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-white transition-all font-semibold text-foreground"
                >
                  +
                </button>
              </div>
            </div>
            <div className="space-y-3 p-4 rounded-lg bg-gray-50 border border-gray-200">
              <label className="text-sm font-semibold text-foreground">Children</label>
              <div className="flex items-center justify-between">
                <button
                  onClick={() => handleTravelersChange("children", travelOptions.travelers.children - 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-white transition-all font-semibold text-foreground"
                >
                  −
                </button>
                <span className="text-2xl font-light text-foreground">{travelOptions.travelers.children}</span>
                <button
                  onClick={() => handleTravelersChange("children", travelOptions.travelers.children + 1)}
                  className="w-10 h-10 rounded-lg border border-gray-300 hover:bg-white transition-all font-semibold text-foreground"
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Tier Selection */}
      {step >= 1 && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center text-sm font-bold">
              4
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Service Tier</h3>
              <p className="text-sm text-muted-foreground">Select your preferred travel experience</p>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {TIERS.map((tier) => (
              <button
                key={tier.id}
                onClick={() => handleTierSelect(tier.id as "standard" | "premium" | "luxury")}
                className={`p-5 rounded-xl border-2 text-left transition-all relative group ${
                  travelOptions.tier === tier.id
                    ? "border-blue-600 bg-blue-50 shadow-lg"
                    : "border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {tier.badge && (
                  <div className="absolute top-3 right-3 bg-blue-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    {tier.badge}
                  </div>
                )}
                <p className="text-3xl mb-3">{tier.icon}</p>
                <p className="font-semibold text-foreground text-base">{tier.name}</p>
                <p className="text-sm text-muted-foreground mt-1">{tier.description}</p>
              </button>
            ))}
          </div>
        </motion.div>
      )}

      <Button
        onClick={onComplete}
        disabled={!canProceed}
        className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white py-6 text-base font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-md hover:shadow-lg"
      >
        {canProceed ? "Continue to Packages" : "Complete all options"}
      </Button>
    </div>
  )
}
