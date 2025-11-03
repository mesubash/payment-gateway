"use client"

import { useRouter } from "next/navigation"
import { usePaymentStore } from "@/lib/store"
import { SuccessAnimation } from "@/components/success-animation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"

export default function SuccessPage() {
  const router = useRouter()
  const { reset } = usePaymentStore()

  const handleGoHome = () => {
    reset()
    router.push("/")
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4 flex items-center justify-center">
      <div className="max-w-2xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-8"
        >
          <SuccessAnimation />

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }}>
            <Button
              onClick={handleGoHome}
              className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg"
            >
              Back to Home
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
