"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Shield, Mountain, ArrowRight } from "lucide-react"

export default function Home() {
  const router = useRouter()

  const handleGetQuote = () => {
    router.push("/trip-details")
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-linear-to-b from-primary/5 via-background to-background min-h-screen flex flex-col">
        {/* Decorative elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/10 rounded-full blur-3xl"></div>
          <div className="absolute top-60 -left-40 w-96 h-96 bg-blue-500/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-1 flex flex-col">
          {/* Header */}
          <div className="pt-12 pb-8 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <Mountain className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground">Himalayan Guardian</h2>
                <p className="text-xs text-muted-foreground">www.hgn.com.np</p>
              </div>
            </div>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Button 
                onClick={handleGetQuote}
                size="lg"
                className="bg-primary hover:bg-primary/90 font-semibold shadow-lg"
              >
                Get Quote
              </Button>
            </motion.div>
          </div>

          {/* Hero Content - Centered */}
          <div className="flex-1 flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-center max-w-4xl"
            >
              <motion.div
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-8"
              >
                <Shield className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">Trusted by 10,000+ Adventurers</span>
              </motion.div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold text-foreground mb-8 leading-tight">
                Your Trusted Guardian
                <br />
                <span className="text-primary">in the Himalayas</span>
              </h1>

              <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-12 leading-relaxed">
                Comprehensive insurance and 24/7 support for trekkers and mountaineers. 
                Get a personalized quote in minutes.
              </p>

              {/* CTA Button */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  onClick={handleGetQuote}
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white font-semibold px-12 py-7 text-lg rounded-xl shadow-2xl hover:shadow-primary/50 transition-all duration-300 group"
                >
                  Get Your Quote
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </motion.div>

              {/* Quick Stats */}
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="flex flex-wrap justify-center gap-12 mt-16"
              >
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">6,000m+</div>
                  <div className="text-sm text-muted-foreground">Max Altitude</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">24/7</div>
                  <div className="text-sm text-muted-foreground">Emergency Support</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold text-foreground mb-2">60 Days</div>
                  <div className="text-sm text-muted-foreground">Max Coverage</div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}
