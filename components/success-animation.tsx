"use client"

import { motion } from "framer-motion"
import { Check } from "lucide-react"

export function SuccessAnimation() {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring", stiffness: 100 }}
      className="flex flex-col items-center justify-center gap-6"
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
        className="w-24 h-24 rounded-full bg-accent/20 flex items-center justify-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, duration: 0.4 }}
          className="w-20 h-20 rounded-full bg-accent flex items-center justify-center"
        >
          <Check className="w-12 h-12 text-accent-foreground" strokeWidth={3} />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="text-center"
      >
        <h2 className="text-3xl font-bold text-foreground mb-2">Payment Successful!</h2>
        <p className="text-muted-foreground">Your travel package has been booked. Check your email for confirmation.</p>
      </motion.div>
    </motion.div>
  )
}
