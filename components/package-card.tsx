"use client"

import { motion } from "framer-motion"
import type { Package } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Sparkles, ArrowRight, Mountain, Clock } from "lucide-react"

interface PackageCardProps {
  package: Package
  onSelect: (pkg: Package) => void
  index?: number
}

export function PackageCard({ package: pkg, onSelect, index = 0 }: PackageCardProps) {
  const tierConfig = {
    basic: {
      gradient: "from-slate-600 via-slate-700 to-slate-800",
      badge: "bg-slate-100 text-slate-900 border-slate-200",
      button: "bg-slate-700 hover:bg-slate-800",
      popular: false,
    },
    plus: {
      gradient: "from-blue-600 via-blue-700 to-blue-800",
      badge: "bg-blue-100 text-blue-900 border-blue-200",
      button: "bg-blue-600 hover:bg-blue-700",
      popular: true,
    },
    pro: {
      gradient: "from-amber-600 via-amber-700 to-amber-800",
      badge: "bg-amber-100 text-amber-900 border-amber-200",
      button: "bg-amber-600 hover:bg-amber-700",
      popular: false,
    },
  }

  const config = tierConfig[pkg.tier]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className={`relative rounded-2xl border-2 overflow-hidden bg-card hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 ${
        config.popular ? "border-primary shadow-lg shadow-primary/5" : "border-border"
      }`}
    >
      {/* Popular Badge */}
      {config.popular && (
        <div className="absolute -top-1 -right-1 z-20">
          <div className="bg-primary text-primary-foreground px-4 py-1 rounded-bl-xl rounded-tr-xl text-xs font-bold uppercase tracking-wide flex items-center gap-1">
            <Sparkles className="w-3 h-3" />
            Most Popular
          </div>
        </div>
      )}

      {/* Altitude Header */}
      <div className={`relative bg-linear-to-br ${config.gradient} p-8 text-white overflow-hidden`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-16 translate-x-16"></div>
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/5 rounded-full translate-y-12 -translate-x-12"></div>
        
        <div className="relative z-10">
          <Badge variant="outline" className={`${config.badge} border mb-4`}>
            {pkg.tier.toUpperCase()} PLAN
          </Badge>
          
          <div className="flex items-end gap-3 mb-2">
            <Mountain className="w-8 h-8 opacity-80" />
            <div className="text-5xl font-bold">{pkg.altitudeLimit}</div>
          </div>
          <div className="text-sm opacity-90 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {pkg.duration} coverage
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-2xl font-bold text-foreground mb-2">{pkg.name}</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">{pkg.description}</p>
        </div>

        {/* Features */}
        <div className="space-y-3">
          {pkg.highlights.slice(0, 4).map((highlight, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 + i * 0.05 }}
              className="flex items-start gap-3"
            >
              <div className="mt-0.5 p-1 bg-primary/10 rounded-full">
                <Check className="w-3 h-3 text-primary" />
              </div>
              <span className="text-sm text-foreground/90 leading-relaxed">{highlight}</span>
            </motion.div>
          ))}
        </div>

        {/* Price */}
        <div className="pt-6 border-t border-border">
          <div className="flex items-end justify-between mb-6">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Package Price</p>
              <div className="flex items-baseline gap-2">
                <span className="text-4xl font-bold text-foreground">${pkg.price}</span>
                <span className="text-sm text-muted-foreground">USD</span>
              </div>
              <p className="text-xs text-muted-foreground mt-1">{pkg.duration} coverage</p>
            </div>
          </div>

          {/* CTA Button */}
          <Button
            onClick={() => onSelect(pkg)}
            className={`w-full ${config.button} text-white font-semibold py-6 rounded-xl transition-all duration-300 group`}
            size="lg"
          >
            <span>Get Quote</span>
            <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </motion.div>
  )
}
