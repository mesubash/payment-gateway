"use client"

import { useState } from "react"
import { PaymentInfo } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { CreditCard, Smartphone, Building2, AlertCircle } from "lucide-react"
import { cn } from "@/lib/utils"

interface PaymentMethodFormProps {
  initialData: PaymentInfo
  onSubmit: (data: PaymentInfo) => void
  onBack: () => void
  isLoading?: boolean
}

type PaymentMethod = "card" | "connectips" | "esewa" | "khalti"

const PAYMENT_METHODS = [
  {
    id: "card" as const,
    name: "Credit/Debit Card",
    icon: CreditCard,
    description: "Visa, Mastercard, Amex",
  },
  {
    id: "connectips" as const,
    name: "ConnectIPS",
    icon: Building2,
    description: "Bank transfer",
  },
  {
    id: "esewa" as const,
    name: "eSewa",
    icon: Smartphone,
    description: "Digital wallet",
  },
  {
    id: "khalti" as const,
    name: "Khalti",
    icon: Smartphone,
    description: "Digital wallet",
  },
]

export function PaymentMethodForm({ initialData, onSubmit, onBack, isLoading = false }: PaymentMethodFormProps) {
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod>("card")
  const [formData, setFormData] = useState<PaymentInfo>(initialData)
  const [errors, setErrors] = useState<Partial<Record<keyof PaymentInfo, string>>>({})

  // For digital wallets
  const [phoneNumber, setPhoneNumber] = useState("")
  const [pin, setPin] = useState("")

  const validateCardForm = () => {
    const newErrors: Partial<Record<keyof PaymentInfo, string>> = {}

    if (!formData.cardholderName.trim()) newErrors.cardholderName = "Cardholder name is required"
    if (!formData.cardNumber.trim()) newErrors.cardNumber = "Card number is required"
    else if (formData.cardNumber.replace(/\s/g, "").length < 13)
      newErrors.cardNumber = "Invalid card number"

    if (!formData.expiry.trim()) newErrors.expiry = "Expiry date is required"
    else if (!/^\d{2}\/\d{2}$/.test(formData.expiry)) newErrors.expiry = "Invalid format (MM/YY)"

    if (!formData.cvv.trim()) newErrors.cvv = "CVV is required"
    else if (formData.cvv.length < 3) newErrors.cvv = "Invalid CVV"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const validateDigitalWallet = () => {
    if (!phoneNumber.trim()) {
      setErrors({ cardNumber: "Phone number is required" })
      return false
    }
    if (phoneNumber.length < 10) {
      setErrors({ cardNumber: "Invalid phone number" })
      return false
    }
    setErrors({})
    return true
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (selectedMethod === "card") {
      if (validateCardForm()) {
        onSubmit(formData)
      }
    } else if (selectedMethod === "connectips") {
      // For ConnectIPS, we'll redirect to bank portal
      onSubmit({ ...formData, cardNumber: "CONNECTIPS" })
    } else {
      // For eSewa/Khalti
      if (validateDigitalWallet()) {
        onSubmit({ ...formData, cardNumber: `${selectedMethod.toUpperCase()}_${phoneNumber}` })
      }
    }
  }

  const handleCardNumberChange = (value: string) => {
    const numbers = value.replace(/\s/g, "")
    const formatted = numbers.replace(/(\d{4})/g, "$1 ").trim()
    setFormData(prev => ({ ...prev, cardNumber: formatted }))
    if (errors.cardNumber) setErrors(prev => ({ ...prev, cardNumber: "" }))
  }

  const handleExpiryChange = (value: string) => {
    let formatted = value.replace(/\D/g, "")
    if (formatted.length >= 2) {
      formatted = formatted.slice(0, 2) + "/" + formatted.slice(2, 4)
    }
    setFormData(prev => ({ ...prev, expiry: formatted }))
    if (errors.expiry) setErrors(prev => ({ ...prev, expiry: "" }))
  }

  const handleCvvChange = (value: string) => {
    const numbers = value.replace(/\D/g, "").slice(0, 4)
    setFormData(prev => ({ ...prev, cvv: numbers }))
    if (errors.cvv) setErrors(prev => ({ ...prev, cvv: "" }))
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <Label className="text-base font-semibold mb-3 block">Select Payment Method</Label>
        <div className="grid md:grid-cols-2 gap-3">
          {PAYMENT_METHODS.map((method) => {
            const Icon = method.icon
            return (
              <Card
                key={method.id}
                className={cn(
                  "cursor-pointer transition-all duration-200 hover:shadow-md",
                  selectedMethod === method.id
                    ? "border-2 border-blue-600 bg-blue-50 dark:bg-blue-950"
                    : "border-2 border-border hover:border-blue-300"
                )}
                onClick={() => setSelectedMethod(method.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div
                      className={cn(
                        "w-10 h-10 rounded-full flex items-center justify-center",
                        selectedMethod === method.id
                          ? "bg-blue-600 text-white"
                          : "bg-muted text-muted-foreground"
                      )}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm">{method.name}</p>
                      <p className="text-xs text-muted-foreground">{method.description}</p>
                    </div>
                    {selectedMethod === method.id && (
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center">
                        <div className="w-2 h-2 rounded-full bg-white" />
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Payment Details */}
      <div className="border-t border-border pt-6">
        {selectedMethod === "card" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-blue-600" />
              Card Details
            </h3>

            <div>
              <Label htmlFor="cardholderName">Cardholder Name</Label>
              <Input
                id="cardholderName"
                value={formData.cardholderName}
                onChange={(e) => {
                  setFormData(prev => ({ ...prev, cardholderName: e.target.value }))
                  if (errors.cardholderName) setErrors(prev => ({ ...prev, cardholderName: "" }))
                }}
                placeholder="John Doe"
              />
              {errors.cardholderName && (
                <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.cardholderName}
                </p>
              )}
            </div>

            <div>
              <Label htmlFor="cardNumber">Card Number</Label>
              <Input
                id="cardNumber"
                value={formData.cardNumber}
                onChange={(e) => handleCardNumberChange(e.target.value)}
                placeholder="1234 5678 9012 3456"
                maxLength={19}
              />
              {errors.cardNumber && (
                <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.cardNumber}
                </p>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="expiry">Expiry Date</Label>
                <Input
                  id="expiry"
                  value={formData.expiry}
                  onChange={(e) => handleExpiryChange(e.target.value)}
                  placeholder="MM/YY"
                  maxLength={5}
                />
                {errors.expiry && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.expiry}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="cvv">CVV</Label>
                <Input
                  id="cvv"
                  type="password"
                  value={formData.cvv}
                  onChange={(e) => handleCvvChange(e.target.value)}
                  placeholder="123"
                  maxLength={4}
                />
                {errors.cvv && (
                  <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {errors.cvv}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {selectedMethod === "connectips" && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Building2 className="h-5 w-5 text-blue-600" />
              ConnectIPS Payment
            </h3>
            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100 mb-2">
                <strong>You will be redirected to:</strong>
              </p>
              <ul className="text-sm text-blue-800 dark:text-blue-200 space-y-1 ml-4 list-disc">
                <li>Select your bank</li>
                <li>Login with your internet banking credentials</li>
                <li>Complete the payment securely</li>
              </ul>
            </div>
          </div>
        )}

        {(selectedMethod === "esewa" || selectedMethod === "khalti") && (
          <div className="space-y-4">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              {selectedMethod === "esewa" ? "eSewa" : "Khalti"} Payment
            </h3>

            <div>
              <Label htmlFor="phone">Mobile Number</Label>
              <Input
                id="phone"
                type="tel"
                value={phoneNumber}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  setPhoneNumber(value)
                }}
                placeholder="98XXXXXXXX"
                maxLength={10}
              />
              {errors.cardNumber && (
                <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors.cardNumber}
                </p>
              )}
            </div>

            <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
              <p className="text-sm text-blue-900 dark:text-blue-100">
                <strong>Note:</strong> You will receive an OTP on your registered mobile number to complete the payment.
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-4 border-t border-border">
        <Button type="button" variant="outline" onClick={onBack} disabled={isLoading} className="flex-1">
          Back
        </Button>
        <Button type="submit" disabled={isLoading} className="flex-1 bg-blue-600 hover:bg-blue-700">
          {isLoading ? "Processing..." : "Complete Payment"}
        </Button>
      </div>
    </form>
  )
}
