"use client"

import type React from "react"

import { useState } from "react"
import type { PaymentInfo } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface PaymentFormProps {
  initialData: PaymentInfo
  onSubmit: (data: PaymentInfo) => void
  onBack: () => void
  isLoading?: boolean
}

export function PaymentForm({ initialData, onSubmit, onBack, isLoading = false }: PaymentFormProps) {
  const [formData, setFormData] = useState<PaymentInfo>(initialData)
  const [errors, setErrors] = useState<Partial<PaymentInfo>>({})

  const validateForm = () => {
    const newErrors: Partial<PaymentInfo> = {}
    if (!formData.cardNumber.replace(/\s/g, "")) newErrors.cardNumber = "Card number is required"
    if (!formData.expiry) newErrors.expiry = "Expiry is required"
    if (!formData.cvv) newErrors.cvv = "CVV is required"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData)
    }
  }

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\s/g, "")
    value = value.replace(/(\d{4})/g, "$1 ").trim()
    setFormData((prev) => ({ ...prev, cardNumber: value }))
  }

  const handleExpiryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, "")
    if (value.length >= 2) {
      value = value.slice(0, 2) + "/" + value.slice(2, 4)
    }
    setFormData((prev) => ({ ...prev, expiry: value }))
  }

  const handleCVVChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 3)
    setFormData((prev) => ({ ...prev, cvv: value }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="cardholderName" className="block text-sm font-medium text-foreground mb-2">
          Cardholder Name
        </label>
        <Input
          id="cardholderName"
          name="cardholderName"
          value={formData.cardholderName}
          onChange={(e) => setFormData((prev) => ({ ...prev, cardholderName: e.target.value }))}
          placeholder="John Doe"
          className="bg-card border-border"
        />
      </div>

      <div>
        <label htmlFor="cardNumber" className="block text-sm font-medium text-foreground mb-2">
          Card Number
        </label>
        <Input
          id="cardNumber"
          value={formData.cardNumber}
          onChange={handleCardChange}
          placeholder="1234 5678 9012 3456"
          maxLength={19}
          className="bg-card border-border font-mono text-lg tracking-widest"
        />
        {errors.cardNumber && <p className="text-destructive text-sm mt-1">{errors.cardNumber}</p>}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="expiry" className="block text-sm font-medium text-foreground mb-2">
            Expiry Date
          </label>
          <Input
            id="expiry"
            value={formData.expiry}
            onChange={handleExpiryChange}
            placeholder="MM/YY"
            maxLength={5}
            className="bg-card border-border font-mono"
          />
          {errors.expiry && <p className="text-destructive text-sm mt-1">{errors.expiry}</p>}
        </div>
        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-foreground mb-2">
            CVV
          </label>
          <Input
            id="cvv"
            value={formData.cvv}
            onChange={handleCVVChange}
            placeholder="123"
            maxLength={3}
            className="bg-card border-border font-mono"
          />
          {errors.cvv && <p className="text-destructive text-sm mt-1">{errors.cvv}</p>}
        </div>
      </div>

      <div className="flex gap-3 pt-6">
        <Button type="button" onClick={onBack} variant="outline" className="flex-1 bg-transparent" disabled={isLoading}>
          Back
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
        >
          {isLoading ? "Processing..." : "Pay Now"}
        </Button>
      </div>
    </form>
  )
}
