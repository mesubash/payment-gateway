"use client"

import { useState } from "react"
import { TripDetails } from "@/lib/store"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { Globe, Users, MapPin, Mountain, CalendarIcon, AlertCircle } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

interface TripDetailsFormProps {
  initialData: TripDetails
  onSubmit: (data: TripDetails, ages: number[]) => void
  onBack: () => void
  buttonText?: string
}

const NATIONALITIES = [
  "Nepali", "Indian", "American", "British", "Canadian", "Australian", 
  "Chinese", "Japanese", "Korean", "German", "French", "Italian", 
  "Spanish", "Thai", "Malaysian", "Singaporean", "Other"
]

const NEPAL_LOCATIONS = [
  "Kathmandu", "Pokhara", "Lukla", "Jomsom", "Namche Bazaar",
  "Manang", "Lo Manthang", "Tatopani", "Ghandruk", "Poon Hill",
  "Gokyo", "Dingboche", "Lobuche", "Phakding", "Tengboche"
]

const ADVENTURES = [
  "Everest Base Camp Trek",
  "Annapurna Circuit",
  "Langtang Valley Trek",
  "Manaslu Circuit",
  "Upper Mustang Trek",
  "Kailash Mansarovar Yatra",
  "Island Peak Climbing",
  "Mera Peak Climbing",
  "Other Adventure"
]

export function TripDetailsForm({ initialData, onSubmit, onBack, buttonText = "Continue to Traveller Details" }: TripDetailsFormProps) {
  const [formData, setFormData] = useState<TripDetails>(initialData)
  const [errors, setErrors] = useState<Partial<Record<keyof TripDetails, string>>>({})
  const [startDate, setStartDate] = useState<Date | undefined>(
    initialData.startDate ? new Date(initialData.startDate) : undefined
  )
  const [endDate, setEndDate] = useState<Date | undefined>(
    initialData.endDate ? new Date(initialData.endDate) : undefined
  )
  const [travellerAges, setTravellerAges] = useState<number[]>(
    Array(initialData.numberOfTravellers || 1).fill(0)
  )
  const [showAges, setShowAges] = useState(false)

  const validateForm = () => {
    const newErrors: Partial<Record<keyof TripDetails, string>> = {}

    if (!formData.nationality) newErrors.nationality = "Nationality is required"
    if (formData.numberOfTravellers < 1) newErrors.numberOfTravellers = "At least 1 traveller required"
    if (formData.numberOfTravellers > 20) newErrors.numberOfTravellers = "Maximum 20 travellers allowed"
    if (!formData.travellingFrom.trim()) newErrors.travellingFrom = "Departure location is required"
    if (!formData.travellingTo.trim()) newErrors.travellingTo = "Destination is required"
    if (!formData.adventure) newErrors.adventure = "Adventure type is required"
    if (!formData.startDate) newErrors.startDate = "Start date is required"
    if (!formData.endDate) newErrors.endDate = "End date is required"

    if (formData.startDate && formData.endDate) {
      const start = new Date(formData.startDate)
      const end = new Date(formData.endDate)
      if (end <= start) {
        newErrors.endDate = "End date must be after start date"
      }
    }

    // Validate all ages are entered
    const allAgesEntered = travellerAges.every(age => age > 0 && age <= 100)
    if (!allAgesEntered) {
      newErrors.numberOfTravellers = "Please enter valid ages for all travellers"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (validateForm()) {
      onSubmit(formData, travellerAges)
    }
  }

  const handleChange = (field: keyof TripDetails, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }

    // When number of travellers changes, update age array and show age section
    if (field === "numberOfTravellers") {
      const count = typeof value === "number" ? value : parseInt(value) || 0
      if (count > 0) {
        const newAges = Array(count).fill(0).map((_, i) => travellerAges[i] || 0)
        setTravellerAges(newAges)
        setShowAges(true)
      } else {
        setTravellerAges([])
        setShowAges(false)
      }
    }
  }

  const handleAgeChange = (index: number, age: number) => {
    const newAges = [...travellerAges]
    newAges[index] = age
    setTravellerAges(newAges)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-2 pb-4 border-b border-border">
          <Mountain className="h-5 w-5 text-blue-600" />
          <h2 className="text-xl font-semibold">Trip Details</h2>
        </div>

        {/* Nationality */}
        <div>
          <Label htmlFor="nationality" className="flex items-center gap-2 mb-2">
            <Globe className="h-4 w-4" />
            Select Nationality <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.nationality} onValueChange={(value) => handleChange("nationality", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Choose your nationality" />
            </SelectTrigger>
            <SelectContent>
              {NATIONALITIES.map((nat) => (
                <SelectItem key={nat} value={nat}>
                  {nat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.nationality && (
            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.nationality}
            </p>
          )}
        </div>

        {/* Number of Travellers */}
        <div>
          <Label htmlFor="numberOfTravellers" className="flex items-center gap-2 mb-2">
            <Users className="h-4 w-4" />
            No. of People <span className="text-destructive">*</span>
          </Label>
          <Input
            id="numberOfTravellers"
            type="text"
            value={formData.numberOfTravellers || ''}
            onChange={(e) => {
              const value = e.target.value.replace(/[^0-9]/g, '');
              if (value === '') {
                handleChange("numberOfTravellers", 0);
              } else {
                const num = parseInt(value);
                if (num >= 1 && num <= 20) {
                  handleChange("numberOfTravellers", num);
                } else if (num > 20) {
                  handleChange("numberOfTravellers", 20);
                }
              }
            }}
            placeholder="Enter number (1-20)"
            className="text-lg"
            maxLength={2}
          />
          {errors.numberOfTravellers && (
            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.numberOfTravellers}
            </p>
          )}
          <p className="text-xs text-muted-foreground mt-1">Enter between 1-20 travellers per booking</p>
        </div>

        {/* Age Inputs - Show when number of travellers is entered */}
        {showAges && formData.numberOfTravellers > 0 && (
          <div className="border-2 border-blue-200 dark:border-blue-800 rounded-lg p-4 bg-blue-50 dark:bg-blue-950">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <h3 className="font-semibold text-base">Enter Age for Each Traveller</h3>
                <p className="text-xs text-muted-foreground">Age is required for all travellers</p>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {travellerAges.map((age, index) => (
                <div key={index} className="space-y-1">
                  <Label htmlFor={`age-${index}`} className="text-xs font-medium">
                    Traveller {index + 1} <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`age-${index}`}
                    type="number"
                    min="1"
                    max="100"
                    value={age || ""}
                    onChange={(e) => handleAgeChange(index, parseInt(e.target.value) || 0)}
                    placeholder="Age"
                    className={`${age > 0 ? "border-green-500 bg-green-50 dark:bg-green-950" : "border-amber-500"}`}
                  />
                  {age > 0 && age < 18 && (
                    <p className="text-amber-600 dark:text-amber-400 text-xs flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" /> Minor
                    </p>
                  )}
                </div>
              ))}
            </div>

            <div className="mt-3 flex items-start gap-2 text-xs text-blue-900 dark:text-blue-100">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <p>
                <strong>Note:</strong> Travellers under 18 years will need to provide nominee information in the next step.
              </p>
            </div>
          </div>
        )}

        {/* Travelling From & To */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="travellingFrom" className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" />
              Travelling From <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.travellingFrom} onValueChange={(value) => handleChange("travellingFrom", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select starting location" />
              </SelectTrigger>
              <SelectContent>
                {NEPAL_LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.travellingFrom && (
              <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.travellingFrom}
              </p>
            )}
          </div>

          <div>
            <Label htmlFor="travellingTo" className="flex items-center gap-2 mb-2">
              <MapPin className="h-4 w-4" />
              Travelling To <span className="text-destructive">*</span>
            </Label>
            <Select value={formData.travellingTo} onValueChange={(value) => handleChange("travellingTo", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select destination" />
              </SelectTrigger>
              <SelectContent>
                {NEPAL_LOCATIONS.map((loc) => (
                  <SelectItem key={loc} value={loc}>
                    {loc}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.travellingTo && (
              <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.travellingTo}
              </p>
            )}
          </div>
        </div>

        {/* Choose Adventure */}
        <div>
          <Label htmlFor="adventure" className="flex items-center gap-2 mb-2">
            <Mountain className="h-4 w-4" />
            Choose your Adventure <span className="text-destructive">*</span>
          </Label>
          <Select value={formData.adventure} onValueChange={(value) => handleChange("adventure", value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your adventure" />
            </SelectTrigger>
            <SelectContent>
              {ADVENTURES.map((adv) => (
                <SelectItem key={adv} value={adv}>
                  {adv}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {errors.adventure && (
            <p className="text-destructive text-sm mt-1 flex items-center gap-1">
              <AlertCircle className="h-3 w-3" /> {errors.adventure}
            </p>
          )}
        </div>

        {/* Dates */}
        <div className="grid md:grid-cols-2 gap-4">
          <div>
            <Label className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-4 w-4" />
              Start Date <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !startDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    setStartDate(date)
                    handleChange("startDate", date ? format(date, "yyyy-MM-dd") : "")
                  }}
                  disabled={(date) => date < new Date()}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.startDate && (
              <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.startDate}
              </p>
            )}
          </div>

          <div>
            <Label className="flex items-center gap-2 mb-2">
              <CalendarIcon className="h-4 w-4" />
              End Date <span className="text-destructive">*</span>
            </Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !endDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={endDate}
                  onSelect={(date) => {
                    setEndDate(date)
                    handleChange("endDate", date ? format(date, "yyyy-MM-dd") : "")
                  }}
                  disabled={(date) => {
                    if (date < new Date()) return true
                    if (startDate && date <= startDate) return true
                    return false
                  }}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            {errors.endDate && (
              <p className="text-destructive text-sm mt-1 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" /> {errors.endDate}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4 pt-6 border-t border-border">
        <Button type="button" variant="outline" onClick={onBack} className="flex-1">
          Back to Packages
        </Button>
        <Button type="submit" className="flex-1 bg-blue-600 hover:bg-blue-700">
          {buttonText}
        </Button>
      </div>
    </form>
  )
}
