"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Users, AlertCircle } from "lucide-react"

interface TravellerAge {
  index: number
  age: number
}

interface TravellerAgesFormProps {
  numberOfTravellers: number
  initialAges?: number[]
  onSubmit: (ages: number[]) => void
  onBack: () => void
}

export function TravellerAgesForm({ numberOfTravellers, initialAges = [], onSubmit, onBack }: TravellerAgesFormProps) {
  const [ages, setAges] = useState<number[]>(
    initialAges.length === numberOfTravellers
      ? initialAges
      : Array(numberOfTravellers).fill(0)
  )
  const [errors, setErrors] = useState<string[]>([])

  const validateForm = () => {
    const newErrors: string[] = []
    ages.forEach((age, index) => {
      if (age < 1 || age > 100) {
        newErrors[index] = "Age must be between 1 and 100"
      } else if (!age) {
        newErrors[index] = "Age is required"
      }
    })
    setErrors(newErrors)
    return newErrors.filter(Boolean).length === 0
  }

  const handleAgeChange = (index: number, value: string) => {
    const newAges = [...ages]
    newAges[index] = parseInt(value) || 0
    setAges(newAges)

    // Clear error for this field
    if (errors[index]) {
      const newErrors = [...errors]
      newErrors[index] = ""
      setErrors(newErrors)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(ages)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <Users className="h-5 w-5 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Traveller Ages</h2>
            <p className="text-sm text-muted-foreground">Enter the age of each traveller</p>
          </div>
        </div>

        {/* Age Inputs */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ages.map((age, index) => (
            <div key={index} className="space-y-2">
              <Label htmlFor={`age-${index}`} className="text-sm font-medium">
                Traveller {index + 1} Age <span className="text-destructive">*</span>
              </Label>
              <Input
                id={`age-${index}`}
                type="number"
                min="1"
                max="100"
                value={age || ""}
                onChange={(e) => handleAgeChange(index, e.target.value)}
                placeholder="Enter age"
                className={errors[index] ? "border-destructive" : ""}
              />
              {errors[index] && (
                <p className="text-destructive text-xs flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> {errors[index]}
                </p>
              )}
              {age > 0 && age < 18 && (
                <p className="text-amber-600 text-xs flex items-center gap-1">
                  <AlertCircle className="h-3 w-3" /> Minor - Nominee details required
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
          <p className="text-sm text-blue-900 dark:text-blue-100">
            <strong>Note:</strong> Travellers under 18 years old will need to provide nominee information in the next step.
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-border">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back
        </Button>
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          Continue
        </Button>
      </div>
    </form>
  )
}
