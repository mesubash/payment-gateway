"use client"

import { useRouter } from "next/navigation"
import { usePaymentStore, type Package } from "@/lib/store"
import { StepIndicator } from "@/components/step-indicator"
import { PackageCard } from "@/components/package-card"
import { motion } from "framer-motion"

const PACKAGES_BY_TIER = {
  standard: [
    {
      id: "1",
      name: "Mediterranean Escape",
      destination: "Mediterranean Coast",
      description: "Experience the charm of Greece and Italy with comfortable accommodations",
      price: 2499,
      duration: "7 days",
      image: "/mediterranean-coast-resort.jpg",
      tier: "standard" as const,
      highlights: ["4-star hotels", "Daily breakfast", "Guided tours", "Airport transfers"],
    },
    {
      id: "2",
      name: "Tokyo Essentials",
      destination: "Tokyo & Kyoto",
      description: "Explore Japan's vibrant culture with quality accommodations",
      price: 2899,
      duration: "8 days",
      image: "/tokyo-city-japan.jpg",
      tier: "standard" as const,
      highlights: ["3-star hotels", "Daily breakfast", "Group tours", "JR pass included"],
    },
    {
      id: "3",
      name: "Safari Adventure",
      destination: "African Safari",
      description: "Witness African wildlife in comfortable safari lodges",
      price: 3199,
      duration: "6 days",
      image: "/african-safari-elephants.jpg",
      tier: "standard" as const,
      highlights: ["Safari lodge", "Game drives", "All meals", "Park fees"],
    },
  ],
  premium: [
    {
      id: "4",
      name: "Riviera Elegance",
      destination: "Mediterranean Coast",
      description: "Luxurious Mediterranean experience with 5-star resorts",
      price: 4999,
      duration: "7 days",
      image: "/luxury-mediterranean-villa.jpg",
      tier: "premium" as const,
      highlights: ["5-star beachfront", "Premium dining", "Private yacht", "Spa access", "Concierge service"],
    },
    {
      id: "5",
      name: "Tokyo Luxury",
      destination: "Tokyo & Kyoto",
      description: "Premium Japanese experience with exclusive access",
      price: 5499,
      duration: "10 days",
      image: "/luxury-tokyo-hotel-japan.jpg",
      tier: "premium" as const,
      highlights: ["5-star hotels", "Private guide", "Michelin dining", "Tea ceremony", "Spa treatments"],
    },
    {
      id: "6",
      name: "Safari Luxury",
      destination: "African Safari",
      description: "Ultimate African safari with luxury lodges",
      price: 6499,
      duration: "8 days",
      image: "/luxury-safari-lodge-africa.jpg",
      tier: "premium" as const,
      highlights: ["Luxury lodge", "Private jeeps", "Expert guides", "Champagne evenings", "Trophy hunting tours"],
    },
  ],
  luxury: [
    {
      id: "7",
      name: "Mediterranean Ultra",
      destination: "Mediterranean Coast",
      description: "Ultimate Mediterranean luxury with private everything",
      price: 9999,
      duration: "10 days",
      image: "/private-luxury-yacht-mediterranean.jpg",
      tier: "luxury" as const,
      highlights: ["Private yacht", "Michelin chefs", "Personal butler", "Helicopter tours", "Jewelry designer visit"],
    },
    {
      id: "8",
      name: "Tokyo Pinnacle",
      destination: "Tokyo & Kyoto",
      description: "The ultimate Japanese experience with imperial access",
      price: 12999,
      duration: "12 days",
      image: "/imperial-palace-tokyo-japan.jpg",
      tier: "luxury" as const,
      highlights: [
        "Palace tours",
        "Imperial dinner",
        "Private Shinkansen",
        "Artisan workshops",
        "Sake master experience",
      ],
    },
    {
      id: "9",
      name: "Safari Pinnacle",
      destination: "African Safari",
      description: "Exclusive African adventure with VIP treatment",
      price: 15999,
      duration: "10 days",
      image: "/vip-luxury-safari-lodge-africa.jpg",
      tier: "luxury" as const,
      highlights: [
        "Private lodge",
        "Helicopter safaris",
        "Celebrity guide",
        "Private airstrip",
        "Conservation program",
      ],
    },
  ],
}

const STEP_LABELS = ["Configure Trip", "Select Package", "Your Details", "Payment", "Confirmation"]

export default function PackagesPage() {
  const router = useRouter()
  const { selectedPackage, setSelectedPackage, travelOptions } = usePaymentStore()
  const packages = PACKAGES_BY_TIER[travelOptions.tier] || PACKAGES_BY_TIER.premium

  const handleSelectPackage = (pkg: Package) => {
    setSelectedPackage(pkg)
    router.push("/details")
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
          <StepIndicator currentStep={1} totalSteps={5} stepLabels={STEP_LABELS} />
        </motion.div>

        <div className="text-center mb-12 mt-8">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
            <h1 className="text-4xl md:text-5xl font-light text-foreground mb-3">
              {travelOptions.tier.charAt(0).toUpperCase() + travelOptions.tier.slice(1)} Packages
            </h1>
            <p className="text-muted-foreground">
              {travelOptions.destination} • {travelOptions.travelers.adults} adult
              {travelOptions.travelers.adults !== 1 ? "s" : ""}
              {travelOptions.travelers.children > 0 &&
                `, ${travelOptions.travelers.children} child${travelOptions.travelers.children !== 1 ? "ren" : ""}`}
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {packages.map((pkg, index) => (
            <PackageCard key={pkg.id} package={pkg} onSelect={handleSelectPackage} index={index} />
          ))}
        </motion.div>
      </div>
    </div>
  )
}
