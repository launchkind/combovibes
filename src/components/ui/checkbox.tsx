"use client"
import * as React from "react"
import { Check } from "lucide-react"
import { cn } from "@/lib/utils"

type CheckboxProps = {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
};

const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, checked, onCheckedChange, disabled, id, ...props }, ref) => (
    <button
      ref={ref}
      id={id}
      role="checkbox"
      aria-checked={checked}
      disabled={disabled}
      onClick={() => onCheckedChange?.(!checked)}
      className={cn(
        "h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 flex items-center justify-center transition-colors",
        checked ? "bg-primary text-primary-foreground" : "bg-background",
        className
      )}
      {...props}
    >
      {checked && <Check className="h-3 w-3" />}
    </button>
  )
)
Checkbox.displayName = "Checkbox"

export { Checkbox }
