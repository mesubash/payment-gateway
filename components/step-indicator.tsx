interface StepIndicatorProps {
  currentStep: number
  totalSteps: number
  stepLabels: string[]
}

export function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="flex items-center justify-between gap-2 mb-12">
      {Array.from({ length: totalSteps }).map((_, index) => (
        <div key={index} className="flex items-center flex-1">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
              index < currentStep
                ? "bg-primary text-primary-foreground"
                : index === currentStep
                  ? "bg-accent text-accent-foreground"
                  : "bg-muted text-muted-foreground"
            }`}
          >
            {index + 1}
          </div>
          {index < totalSteps - 1 && (
            <div className={`flex-1 h-1 mx-2 transition-all ${index < currentStep ? "bg-primary" : "bg-border"}`} />
          )}
        </div>
      ))}
      <div className="text-sm text-muted-foreground font-medium">{stepLabels[currentStep]}</div>
    </div>
  )
}
