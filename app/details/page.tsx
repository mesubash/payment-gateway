"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePaymentStore, type TripDetails, type TravellerInfo } from "@/lib/store"
import { StepIndicator } from "@/components/step-indicator"
import { TripDetailsForm } from "@/components/trip-details-form"
import { MultiTravellerForm } from "@/components/multi-traveller-form"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Shield, Mountain, Clock, CreditCard, Users } from "lucide-react"

const STEP_LABELS = ["Select Package", "Your Details", "Payment", "Confirmation"]

type FormStep = "trip-details" | "traveller-forms"

export default function DetailsPage() {
  const router = useRouter()
  const { selectedPackage, bookingDetails, setBookingDetails } = usePaymentStore()
  const [currentStep, setCurrentStep] = useState<FormStep>("trip-details")
  const [tripDetails, setTripDetails] = useState<TripDetails>(bookingDetails.tripDetails)
  const [formData, setFormData] = useState<Partial<TravellerInfo>>({})

  if (!selectedPackage) {
    router.push("/")
    return null
  }

  const [travellerAges, setTravellerAges] = useState<number[]>([])

  const handleTripDetailsSubmit = (data: TripDetails, ages: number[]) => {
    setTripDetails(data)
    setTravellerAges(ages)
    
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
    
    setCurrentStep("traveller-forms")
  }

  const handleTravellersSubmit = (travellers: TravellerInfo[]) => {
    setBookingDetails({
      ...bookingDetails,
      tripDetails,
      travellers,
    })
    router.push("/payment")
  }

  const handleBack = () => {
    if (currentStep === "traveller-forms") {
      setCurrentStep("trip-details")
    } else {
      router.push("/")
    }
  }

  const handleFormChange = (data: Partial<TravellerInfo>) => {
    setFormData(data)
  }

  const totalPrice = selectedPackage.price * tripDetails.numberOfTravellers

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <StepIndicator currentStep={1} totalSteps={4} stepLabels={STEP_LABELS} />
        </motion.div>

        <div className="text-center mb-8 mt-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            {currentStep === "trip-details" && "Trip Details"}
            {currentStep === "traveller-forms" && "Traveller Information"}
          </h1>
          <p className="text-muted-foreground">
            {currentStep === "trip-details" && "Tell us about your adventure"}
            {currentStep === "traveller-forms" && "Complete details for all travellers"}
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Form Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <Card className="border-2 shadow-lg">
              <CardContent className="p-8">
                {currentStep === "trip-details" && (
                  <TripDetailsForm
                    initialData={tripDetails}
                    onSubmit={handleTripDetailsSubmit}
                    onBack={() => router.push("/")}
                  />
                )}
                {currentStep === "traveller-forms" && (
                  <MultiTravellerForm
                    numberOfTravellers={tripDetails.numberOfTravellers}
                    initialData={bookingDetails.travellers}
                    onSubmit={handleTravellersSubmit}
                    onBack={handleBack}
                  />
                )}
              </CardContent>
            </Card>
          </motion.div>

          {/* Summary Card - Sticky */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8 space-y-4">
              {/* Package Summary */}
              <Card className="border-2 shadow-xl bg-linear-to-br from-white to-blue-50 dark:from-slate-900 dark:to-slate-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-4">
                    <Shield className="w-5 h-5 text-blue-600" />
                    <h3 className="font-bold text-lg">Booking Summary</h3>
                  </div>
                  
                  {/* Package Info */}
                  <div className="space-y-4 mb-6 pb-6 border-b border-border">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Selected Plan</p>
                      <p className="font-bold text-xl text-foreground">{selectedPackage.name}</p>
                      <p className="text-sm text-muted-foreground mt-1">${selectedPackage.price} per person</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-blue-600" />
                        <span className="text-muted-foreground">{selectedPackage.duration}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Mountain className="w-4 h-4 text-blue-600" />
                        <span className="text-muted-foreground">≤{selectedPackage.altitudeLimit}</span>
                      </div>
                    </div>
                  </div>

                  {/* Trip Info */}
                  {tripDetails.numberOfTravellers > 0 && (
                    <div className="space-y-3 mb-6 pb-6 border-b border-border">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-600" />
                        <span className="font-medium">{tripDetails.numberOfTravellers} {tripDetails.numberOfTravellers === 1 ? 'Traveller' : 'Travellers'}</span>
                      </div>
                      {tripDetails.adventure && (
                        <p className="text-sm text-muted-foreground">{tripDetails.adventure}</p>
                      )}
                    </div>
                  )}

                  {/* Price */}
                  <div className="bg-blue-600 dark:bg-blue-700 text-white rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs opacity-90 mb-1">Total Amount</p>
                        <p className="text-3xl font-bold">${totalPrice}</p>
                        {tripDetails.numberOfTravellers > 1 && (
                          <p className="text-xs opacity-75 mt-1">
                            ${selectedPackage.price} × {tripDetails.numberOfTravellers} travellers
                          </p>
                        )}
                      </div>
                      <CreditCard className="w-8 h-8 opacity-90" />
                    </div>
                    <p className="text-xs opacity-75 mt-2">USD • Secure Payment</p>
                  </div>

                  {/* Trust Badge */}
                  <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                    <Shield className="w-3 h-3 text-green-600" />
                    <span>256-bit SSL Encrypted</span>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card className="border border-border">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Shield className="w-4 h-4 text-green-600" />
                    <span>Your information is secure and encrypted</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
