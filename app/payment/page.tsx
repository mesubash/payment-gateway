"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { usePaymentStore, type PaymentInfo } from "@/lib/store"
import { StepIndicator } from "@/components/step-indicator"
import { PaymentMethodForm } from "@/components/payment-method-form"
import { BookingSummary } from "@/components/booking-summary"
import { motion } from "framer-motion"

const STEP_LABELS = ["Select Package", "Your Details", "Payment", "Confirmation"]

export default function PaymentPage() {
  const router = useRouter()
  const { selectedPackage, userInfo, bookingDetails, paymentInfo, setPaymentInfo } = usePaymentStore()
  const [isLoading, setIsLoading] = useState(false)

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
  const totalPrice = selectedPackage.price * numberOfTravellers

  const handleSubmit = async (data: PaymentInfo) => {
    setIsLoading(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setPaymentInfo(data)
    setIsLoading(false)
    router.push("/success")
  }

  const handleBack = () => {
    router.push("/details")
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <StepIndicator currentStep={2} totalSteps={4} stepLabels={STEP_LABELS} />
        </motion.div>

        <div className="text-center mb-8 mt-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Payment Details</h1>
          <p className="text-muted-foreground">Secure payment processing</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lg:col-span-2"
          >
            <div className="rounded-lg border-2 border-border bg-card shadow-lg p-8">
              <PaymentMethodForm initialData={paymentInfo} onSubmit={handleSubmit} onBack={handleBack} isLoading={isLoading} />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className="sticky top-8">
              <BookingSummary 
                package={selectedPackage} 
                userInfo={userInfo}
                bookingDetails={bookingDetails}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
