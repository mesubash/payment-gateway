"use client"

import type { Package } from "@/lib/store"
import { motion } from "framer-motion"

interface OrderSummaryProps {
  package: Package
}

export function OrderSummary({ package: pkg }: OrderSummaryProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-lg border border-border bg-card p-6 space-y-4"
    >
      <h3 className="text-lg font-bold text-foreground">Order Summary</h3>
      <div className="space-y-3 border-t border-border pt-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Package</span>
          <span className="font-medium text-foreground">{pkg.name}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Duration</span>
          <span className="font-medium text-foreground">{pkg.duration}</span>
        </div>
        <div className="border-t border-border pt-3 flex justify-between">
          <span className="font-bold text-foreground">Total</span>
          <span className="text-2xl font-bold text-primary">${pkg.price}</span>
        </div>
      </div>
    </motion.div>
  )
}
