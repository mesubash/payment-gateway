"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePaymentStore, type TripDetails } from "@/lib/store"
import { TripDetailsForm } from "@/components/trip-details-form"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Mountain, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function TripDetailsPage() {
  const router = useRouter()
  const { bookingDetails, setBookingDetails } = usePaymentStore()

  const handleTripDetailsSubmit = (data: TripDetails, ages: number[]) => {
    // Pre-fill traveller ages
    const travellersWithAges = ages.map(age => ({
      fullName: "",
      email: "",
      phone: "",
      countryCode: "+977",
      passportNumber: "",
      nationality: "",
      dateOfBirth: "",
      gender: "" as const,
      age,
      nomineeName: "",
      nomineeRelation: "",
      emergencyName: "",
      emergencyContact: "",
      emergencyEmail: "",
    }))
    
    setBookingDetails({
      ...bookingDetails,
      tripDetails: data,
      travellers: travellersWithAges,
    })
    
    router.push("/select-plan")
  }

  const handleBack = () => {
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-4xl mx-auto">
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
                <Mountain className="w-6 h-6 text-primary" />
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-foreground">Trip Details</h1>
            </div>
            <p className="text-muted-foreground text-lg">
              Tell us about your adventure to get an accurate quote
            </p>
          </div>
        </motion.div>

        {/* Trip Details Form */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card className="border-2 border-border">
            <CardContent className="p-8">
              <TripDetailsForm
                initialData={bookingDetails.tripDetails}
                onSubmit={handleTripDetailsSubmit}
                onBack={handleBack}
                buttonText="Get Quote"
              />
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}
