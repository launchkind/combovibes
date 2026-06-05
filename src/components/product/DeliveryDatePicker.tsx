"use client";
import { CalendarDays } from "lucide-react";
import { addDays, format } from "date-fns";

type Props = { value: string; onChange: (v: string) => void };

export function DeliveryDatePicker({ value, onChange }: Props) {
  const today = new Date();
  const options = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i);
    return {
      value: format(d, "yyyy-MM-dd"),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(d, "EEE, d MMM"),
    };
  });

  return (
    <div>
      <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
        <CalendarDays className="h-4 w-4 text-primary" />
        Select Delivery Date
      </p>
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        {options.map((opt) => (
          <button
            key={opt.value}
            onClick={() => onChange(opt.value)}
            className={`shrink-0 px-3 py-2 rounded-xl border-2 text-xs font-medium transition-all whitespace-nowrap ${
              value === opt.value
                ? "border-primary bg-primary/5 text-primary"
                : "border-border text-muted-foreground hover:border-primary/40"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>
    </div>
  );
}
