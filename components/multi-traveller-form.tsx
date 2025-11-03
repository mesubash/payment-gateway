"use client"

import { useState } from "react"
import { TravellerInfo } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { User, Mail, Phone, CreditCard, Globe, AlertCircle, UserCheck, ChevronLeft, ChevronRight } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface MultiTravellerFormProps {
  numberOfTravellers: number
  initialData?: TravellerInfo[]
  onSubmit: (travellers: TravellerInfo[]) => void
  onBack: () => void
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
]

const NATIONALITIES = [
  "Nepali", "Indian", "American", "British", "Canadian", "Australian",
  "Chinese", "Japanese", "Korean", "German", "French", "Other"
]

const RELATIONS = [
  "Father", "Mother", "Guardian", "Sibling", "Relative", "Other"
]

const createEmptyTraveller = (age?: number): TravellerInfo => ({
  fullName: "",
  email: "",
  phone: "",
  countryCode: "+977",
  passportNumber: "",
  nationality: "",
  dateOfBirth: "",
  gender: "",
  age: age || 0,
  nomineeName: "",
  nomineeRelation: "",
  emergencyName: "",
  emergencyContact: "",
  emergencyEmail: "",
})

export function MultiTravellerForm({ numberOfTravellers, initialData, onSubmit, onBack }: MultiTravellerFormProps) {
  const { toast } = useToast()
  const [travellers, setTravellers] = useState<TravellerInfo[]>(
    initialData && initialData.length === numberOfTravellers
      ? initialData
      : Array(numberOfTravellers).fill(null).map(() => createEmptyTraveller())
  )
  const [currentTab, setCurrentTab] = useState("0")
  const [errors, setErrors] = useState<Array<Partial<Record<keyof TravellerInfo, string>>>>([])

  const validateTraveller = (traveller: TravellerInfo, index: number) => {
    const newErrors: Partial<Record<keyof TravellerInfo, string>> = {}

    if (!traveller.fullName.trim()) newErrors.fullName = "Full name is required"
    if (!traveller.email.trim()) newErrors.email = "Email is required"
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(traveller.email)) newErrors.email = "Invalid email"
    if (!traveller.phone.trim()) newErrors.phone = "Phone is required"
    if (!traveller.passportNumber.trim()) newErrors.passportNumber = "Passport/ID is required"
    if (!traveller.nationality) newErrors.nationality = "Nationality is required"
    if (!traveller.gender) newErrors.gender = "Gender is required"
    if (!traveller.dateOfBirth) newErrors.dateOfBirth = "Date of birth is required"

    // For minors
    if (traveller.age && traveller.age < 18) {
      if (!traveller.nomineeName?.trim()) newErrors.nomineeName = "Nominee name is required for minors"
      if (!traveller.nomineeRelation) newErrors.nomineeRelation = "Nominee relation is required for minors"
    }

    // Emergency contact
    if (!traveller.emergencyName?.trim()) newErrors.emergencyName = "Emergency contact name is required"
    if (!traveller.emergencyContact?.trim()) newErrors.emergencyContact = "Emergency contact number is required"

    return newErrors
  }

  const validateAllTravellers = () => {
    const allErrors = travellers.map((traveller, index) => validateTraveller(traveller, index))
    setErrors(allErrors)
    
    // Find first error and show toast
    const hasErrors = allErrors.some(err => Object.keys(err).length > 0)
    if (hasErrors) {
      const firstErrorIndex = allErrors.findIndex(err => Object.keys(err).length > 0)
      const firstError = allErrors[firstErrorIndex]
      const firstErrorField = Object.keys(firstError)[0]
      const errorMessage = firstError[firstErrorField as keyof TravellerInfo]
      
      toast({
        title: `Error in Traveller ${firstErrorIndex + 1}`,
        description: errorMessage,
        variant: "destructive",
      })
      
      // Switch to the tab with the error
      setCurrentTab(firstErrorIndex.toString())
    }
    
    return !hasErrors
  }

  const handleChange = (index: number, field: keyof TravellerInfo, value: string | number) => {
    const newTravellers = [...travellers]
    newTravellers[index] = { ...newTravellers[index], [field]: value }
    setTravellers(newTravellers)

    // Clear error
    if (errors[index]?.[field]) {
      const newErrors = [...errors]
      newErrors[index] = { ...newErrors[index], [field]: "" }
      setErrors(newErrors)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateAllTravellers()) {
      onSubmit(travellers)
    }
  }

  const renderTravellerForm = (traveller: TravellerInfo, index: number) => {
    const isMinor = traveller.age && traveller.age < 18
    const travellerErrors = errors[index] || {}

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-2">
            <User className="h-5 w-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold">Traveller {index + 1}</h3>
              <p className="text-sm text-muted-foreground">Age: {traveller.age} years {isMinor && "(Minor)"}</p>
            </div>
          </div>
          {isMinor && (
            <span className="bg-amber-100 dark:bg-amber-900 text-amber-700 dark:text-amber-300 text-xs font-medium px-2 py-1 rounded">
              Nominee Required
            </span>
          )}
        </div>

        {/* Personal Details */}
        <div className="space-y-4">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Personal Information</h4>
          
          <div>
            <Label>Full Name (as per passport) <span className="text-destructive">*</span></Label>
            <Input
              value={traveller.fullName}
              onChange={(e) => handleChange(index, "fullName", e.target.value)}
              placeholder="Enter full name"
            />
            {travellerErrors.fullName && (
              <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {travellerErrors.fullName}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Email <span className="text-destructive">*</span></Label>
              <Input
                type="email"
                value={traveller.email}
                onChange={(e) => handleChange(index, "email", e.target.value)}
                placeholder="email@example.com"
              />
              {travellerErrors.email && (
                <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {travellerErrors.email}
                </p>
              )}
            </div>

            <div>
              <Label>Phone <span className="text-destructive">*</span></Label>
              <div className="flex gap-2">
                <Select
                  value={traveller.countryCode}
                  onValueChange={(value) => handleChange(index, "countryCode", value)}
                >
                  <SelectTrigger className="w-[110px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {COUNTRY_CODES.map((item) => (
                      <SelectItem key={item.code} value={item.code}>
                        {item.code}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Input
                  type="tel"
                  value={traveller.phone}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '')
                    handleChange(index, "phone", value)
                  }}
                  placeholder="9841234567"
                  className="flex-1"
                  maxLength={15}
                />
              </div>
              {travellerErrors.phone && (
                <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {travellerErrors.phone}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Date of Birth <span className="text-destructive">*</span></Label>
              <Input
                type="date"
                value={traveller.dateOfBirth}
                onChange={(e) => handleChange(index, "dateOfBirth", e.target.value)}
              />
              {travellerErrors.dateOfBirth && (
                <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {travellerErrors.dateOfBirth}
                </p>
              )}
            </div>

            <div>
              <Label>Gender <span className="text-destructive">*</span></Label>
              <Select
                value={traveller.gender}
                onValueChange={(value) => handleChange(index, "gender", value as any)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              {travellerErrors.gender && (
                <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {travellerErrors.gender}
                </p>
              )}
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Passport/ID Number <span className="text-destructive">*</span></Label>
              <Input
                value={traveller.passportNumber}
                onChange={(e) => handleChange(index, "passportNumber", e.target.value)}
                placeholder="Enter passport number"
              />
              {travellerErrors.passportNumber && (
                <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {travellerErrors.passportNumber}
                </p>
              )}
            </div>

            <div>
              <Label>Nationality <span className="text-destructive">*</span></Label>
              <Select
                value={traveller.nationality}
                onValueChange={(value) => handleChange(index, "nationality", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select nationality" />
                </SelectTrigger>
                <SelectContent>
                  {NATIONALITIES.map((nat) => (
                    <SelectItem key={nat} value={nat}>
                      {nat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {travellerErrors.nationality && (
                <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {travellerErrors.nationality}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Nominee (for minors) */}
        {isMinor && (
          <div className="space-y-4 pt-6 border-t">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-amber-600" />
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">
                Nominee Information (Required for Minors)
              </h4>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <Label>Nominee Name <span className="text-destructive">*</span></Label>
                <Input
                  value={traveller.nomineeName || ""}
                  onChange={(e) => handleChange(index, "nomineeName", e.target.value)}
                  placeholder="Enter nominee name"
                />
                {travellerErrors.nomineeName && (
                  <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {travellerErrors.nomineeName}
                  </p>
                )}
              </div>

              <div>
                <Label>Relation <span className="text-destructive">*</span></Label>
                <Select
                  value={traveller.nomineeRelation || ""}
                  onValueChange={(value) => handleChange(index, "nomineeRelation", value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select relation" />
                  </SelectTrigger>
                  <SelectContent>
                    {RELATIONS.map((rel) => (
                      <SelectItem key={rel} value={rel}>
                        {rel}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {travellerErrors.nomineeRelation && (
                  <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3" /> {travellerErrors.nomineeRelation}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Emergency Contact */}
        <div className="space-y-4 pt-6 border-t">
          <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wider">Emergency Contact</h4>

          <div>
            <Label>Emergency Contact Name <span className="text-destructive">*</span></Label>
            <Input
              value={traveller.emergencyName || ""}
              onChange={(e) => handleChange(index, "emergencyName", e.target.value)}
              placeholder="Enter emergency contact name"
            />
            {travellerErrors.emergencyName && (
              <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {travellerErrors.emergencyName}
              </p>
            )}
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label>Emergency Phone <span className="text-destructive">*</span></Label>
              <Input
                type="tel"
                value={traveller.emergencyContact || ""}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^0-9]/g, '')
                  handleChange(index, "emergencyContact", value)
                }}
                placeholder="Emergency phone number"
                maxLength={15}
              />
              {travellerErrors.emergencyContact && (
                <p className="text-destructive text-xs mt-1 flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {travellerErrors.emergencyContact}
                </p>
              )}
            </div>

            <div>
              <Label>Emergency Email</Label>
              <Input
                type="email"
                value={traveller.emergencyEmail || ""}
                onChange={(e) => handleChange(index, "emergencyEmail", e.target.value)}
                placeholder="Emergency email (optional)"
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentTravellerIndex = parseInt(currentTab)
  const canGoPrevious = currentTravellerIndex > 0
  const canGoNext = currentTravellerIndex < numberOfTravellers - 1

  const handlePrevious = () => {
    if (canGoPrevious) {
      setCurrentTab((currentTravellerIndex - 1).toString())
    }
  }

  const handleNext = () => {
    if (canGoNext) {
      setCurrentTab((currentTravellerIndex + 1).toString())
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Traveller Forms */}
      {numberOfTravellers === 1 ? (
        <Card>
          <CardContent className="p-6">
            {renderTravellerForm(travellers[0], 0)}
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Navigation Header */}
          <div className="flex items-center justify-between gap-4 bg-muted/50 p-4 rounded-lg">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handlePrevious}
              disabled={!canGoPrevious}
              className="gap-2"
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>

            <div className="flex items-center gap-2">
              {/* Traveller Indicator Dots */}
              <div className="flex gap-1.5">
                {travellers.map((_, index) => {
                  const hasErrors = errors[index] && Object.keys(errors[index]).length > 0
                  const isComplete = !hasErrors && (
                    travellers[index].fullName &&
                    travellers[index].email &&
                    travellers[index].phone &&
                    travellers[index].passportNumber &&
                    travellers[index].nationality &&
                    travellers[index].gender &&
                    travellers[index].dateOfBirth &&
                    travellers[index].emergencyName &&
                    travellers[index].emergencyContact
                  )
                  
                  return (
                    <button
                      key={index}
                      type="button"
                      onClick={() => setCurrentTab(index.toString())}
                      className={`h-2.5 rounded-full transition-all ${
                        index === currentTravellerIndex
                          ? 'w-8 bg-blue-600'
                          : isComplete
                          ? 'w-2.5 bg-green-500'
                          : hasErrors
                          ? 'w-2.5 bg-red-500'
                          : 'w-2.5 bg-gray-300 dark:bg-gray-600'
                      }`}
                      title={`Traveller ${index + 1}${isComplete ? ' (Complete)' : hasErrors ? ' (Has Errors)' : ''}`}
                    />
                  )
                })}
              </div>
              
              <span className="text-sm font-medium text-muted-foreground ml-2">
                {currentTravellerIndex + 1} / {numberOfTravellers}
              </span>
            </div>

            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleNext}
              disabled={!canGoNext}
              className="gap-2"
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>

          {/* Current Traveller Form */}
          <Card>
            <CardContent className="p-6">
              {renderTravellerForm(travellers[currentTravellerIndex], currentTravellerIndex)}
            </CardContent>
          </Card>

          {/* Quick Jump to Travellers (for larger groups) */}
          {numberOfTravellers > 5 && (
            <div className="flex flex-wrap gap-2 justify-center p-4 bg-muted/30 rounded-lg">
              <span className="text-xs text-muted-foreground w-full text-center mb-2">Quick Jump:</span>
              {travellers.map((_, index) => {
                const hasErrors = errors[index] && Object.keys(errors[index]).length > 0
                const isComplete = !hasErrors && (
                  travellers[index].fullName &&
                  travellers[index].email &&
                  travellers[index].phone
                )
                
                return (
                  <Button
                    key={index}
                    type="button"
                    variant={index === currentTravellerIndex ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentTab(index.toString())}
                    className={`min-w-[3rem] ${
                      hasErrors ? 'border-red-500 text-red-600' :
                      isComplete ? 'border-green-500 text-green-600' : ''
                    }`}
                  >
                    {index + 1}
                  </Button>
                )
              })}
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          Continue to Payment
        </Button>
      </div>
    </form>
  )
}
