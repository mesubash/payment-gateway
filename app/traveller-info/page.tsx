"use client"

import { useRouter } from "next/navigation"
import { usePaymentStore, type TravellerInfo } from "@/lib/store"
import { MultiTravellerForm } from "@/components/multi-traveller-form"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Users, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TravellerInfoPage() {
  const router = useRouter()
  const { selectedPackage, bookingDetails, setBookingDetails } = usePaymentStore()

  // Check if running in browser before redirecting
  if (typeof window !== 'undefined' && !selectedPackage) {
    router.push("/")
    return null
  }
  
  // Return null during SSR if no package selected
  if (!selectedPackage) {
    return null
  }

  const numberOfTravellers = bookingDetails.tripDetails.numberOfTravellers || 1

  const handleTravellersSubmit = (travellers: TravellerInfo[]) => {
    setBookingDetails({
      ...bookingDetails,
      travellers,
    })
    router.push("/payment")
  }

  const handleBack = () => {
    router.push("/select-plan")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-6xl mx-auto">
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
            Back to Plans
          </Button>

          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Users className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Traveller Information</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Please provide details for all travellers
            </p>
          </div>
        </motion.div>

        {/* Selected Package Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card className="mb-6 border-2 border-primary/20 bg-card/50 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between flex-wrap gap-4">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary/10 rounded-lg">
                    <Shield className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Selected Plan</p>
                    <h3 className="text-xl font-bold text-foreground">{selectedPackage.name}</h3>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Total Cost</p>
                  <p className="text-2xl font-bold text-primary">
                    ${selectedPackage.price * numberOfTravellers}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {numberOfTravellers} {numberOfTravellers === 1 ? 'traveller' : 'travellers'} × ${selectedPackage.price}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Traveller Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <MultiTravellerForm
            numberOfTravellers={numberOfTravellers}
            initialData={bookingDetails.travellers}
            onSubmit={handleTravellersSubmit}
            onBack={handleBack}
          />
        </motion.div>
      </div>
    </div>
  )
}
