"use client"

import React, { useState } from "react"
import type { UserInfo } from "@/lib/store"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Shield, MapPin, User, Mail, Phone, CreditCard, Globe, Flag, AlertCircle } from "lucide-react"

interface UserFormProps {
  initialData: UserInfo
  onSubmit: (data: UserInfo) => void
  onBack: () => void
  onFormChange?: (data: Partial<UserInfo>) => void
}

const COUNTRY_CODES = [
  { code: "+977", country: "Nepal" },
  { code: "+91", country: "India" },
  { code: "+1", country: "USA/Canada" },
  { code: "+44", country: "UK" },
  { code: "+61", country: "Australia" },
  { code: "+86", country: "China" },
  { code: "+81", country: "Japan" },
  { code: "+82", country: "South Korea" },
  { code: "+49", country: "Germany" },
  { code: "+33", country: "France" },
]

export function UserForm({ initialData, onSubmit, onBack, onFormChange }: UserFormProps) {
  const [formData, setFormData] = useState<UserInfo>(initialData)
  const [errors, setErrors] = useState<Partial<Record<keyof UserInfo, string>>>({})

  // Notify parent of form changes in real-time
  const updateFormData = (updates: Partial<UserInfo>) => {
    const newData = { ...formData, ...updates }
    setFormData(newData)
    if (onFormChange) {
      onFormChange(newData)
    }
  }

  const validateForm = () => {
    const newErrors: Partial<Record<keyof UserInfo, string>> = {}

    if (!formData.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) newErrors.email = "Invalid email address"

    if (!formData.phone.trim()) newErrors.phone = "Phone number is required"
    if (!formData.passportNumber.trim()) newErrors.passportNumber = "Passport/ID number is required"
    if (!formData.nationality.trim()) newErrors.nationality = "Nationality is required"
    if (!formData.countryOfResidence.trim()) newErrors.countryOfResidence = "Country of residence is required"
    if (!formData.agreeToTerms) newErrors.agreeToTerms = "You must agree to terms and conditions"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    updateFormData({ [name]: value })
    if (errors[name as keyof UserInfo]) {
      setErrors(prev => ({ ...prev, [name]: "" }))
    }
  }

  const handleCheckboxChange = (checked: boolean) => {
    updateFormData({ agreeToTerms: checked })
    if (errors.agreeToTerms) setErrors(prev => ({ ...prev, agreeToTerms: "" }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 pb-4 border-b border-border">
        <User className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Traveller Information</h2>
      </div>

      {/* Full Name */}
      <div>
        <label htmlFor="fullName" className="block text-sm font-medium mb-2">
          Full Name <span className="text-destructive">*</span>
        </label>
        <Input id="fullName" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="As per passport/ID" />
        {errors.fullName && (
          <p className="text-destructive text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.fullName}
          </p>
        )}
      </div>

      {/* Email + Phone */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            <Mail className="h-4 w-4 inline mr-1" /> Email Address <span className="text-destructive">*</span>
          </label>
          <Input id="email" name="email" value={formData.email} onChange={handleChange} placeholder="your.email@example.com" />
          {errors.email && (
            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.email}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            <Phone className="h-4 w-4 inline mr-1" /> Phone Number <span className="text-destructive">*</span>
          </label>
          <div className="flex gap-2">
            <Select value={formData.countryCode} onValueChange={value => updateFormData({ countryCode: value })}>
              <SelectTrigger className="w-[120px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRY_CODES.map(item => (
                  <SelectItem key={item.code} value={item.code}>
                    {item.code}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input id="phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="9841234567" className="flex-1" />
          </div>
          {errors.phone && (
            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.phone}
            </p>
          )}
        </div>
      </div>

      {/* Passport + Nationality */}
      <div className="grid md:grid-cols-2 gap-4">
        <div>
          <label htmlFor="passportNumber" className="block text-sm font-medium mb-2">
            <CreditCard className="h-4 w-4 inline mr-1" /> Passport / ID Number <span className="text-destructive">*</span>
          </label>
          <Input id="passportNumber" name="passportNumber" value={formData.passportNumber} onChange={handleChange} placeholder="A12345678" className="uppercase" />
          {errors.passportNumber && (
            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.passportNumber}
            </p>
          )}
        </div>

        <div>
          <label htmlFor="nationality" className="block text-sm font-medium mb-2">
            <Flag className="h-4 w-4 inline mr-1" /> Nationality <span className="text-destructive">*</span>
          </label>
          <Input id="nationality" name="nationality" value={formData.nationality} onChange={handleChange} placeholder="e.g., Nepali, Indian" />
          {errors.nationality && (
            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.nationality}
            </p>
          )}
        </div>
      </div>

      {/* Country of Residence */}
      <div>
        <label htmlFor="countryOfResidence" className="block text-sm font-medium mb-2">
          <Globe className="h-4 w-4 inline mr-1" /> Country of Residence <span className="text-destructive">*</span>
        </label>
        <Input id="countryOfResidence" name="countryOfResidence" value={formData.countryOfResidence} onChange={handleChange} placeholder="Country you currently live in" />
        {errors.countryOfResidence && (
          <p className="text-destructive text-sm mt-1 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.countryOfResidence}
          </p>
        )}
      </div>

      {/* Billing Address */}
      <div>
        <label htmlFor="billingAddress" className="block text-sm font-medium mb-2">
          <MapPin className="h-4 w-4 inline mr-1" /> Billing Address <span className="text-muted-foreground text-xs">(Optional)</span>
        </label>
        <Textarea id="billingAddress" name="billingAddress" value={formData.billingAddress} onChange={handleChange} rows={3} placeholder="Street, City, Postal Code" />
      </div>

      {/* Terms */}
      <div className="border p-4 rounded-lg bg-muted/30">
        <div className="flex items-start space-x-3">
          <Checkbox id="agreeToTerms" checked={formData.agreeToTerms} onCheckedChange={handleCheckboxChange} />
          <div className="flex-1">
            <label htmlFor="agreeToTerms" className="text-sm font-medium cursor-pointer">
              I agree to the Terms & Conditions <span className="text-destructive">*</span>
            </label>
            <p className="text-xs text-muted-foreground mt-1">
              By checking this, you agree to our{" "}
              <a href="https://www.hgn.com.np/terms" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Terms of Service
              </a>{" "}
              and{" "}
              <a href="https://www.hgn.com.np/privacy" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
        {errors.agreeToTerms && (
          <p className="text-destructive text-sm mt-2 flex items-center gap-1">
            <AlertCircle className="h-3 w-3" /> {errors.agreeToTerms}
          </p>
        )}
      </div>

      {/* Security Info */}
      <div className="flex items-start gap-3 p-4 bg-primary/5 border border-primary/20 rounded-lg">
        <Shield className="h-5 w-5 text-primary mt-0.5" />
        <div className="text-sm">
          <p className="font-medium">Your information is secure</p>
          <p className="text-muted-foreground text-xs mt-1">
            We use industry-standard encryption to protect your personal data. Your information will only be used for booking purposes.
          </p>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex gap-3 pt-6">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back to Package
        </Button>
        <Button type="submit" className="flex-1 bg-primary hover:bg-primary/90">
          Proceed to Payment
        </Button>
      </div>
    </form>
  )
}
