"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, MessageSquareHeart } from "lucide-react";
import { addDays, format } from "date-fns";
import { cn } from "@/lib/utils";

const slots = [
  { label: "Morning", time: "8 AM – 12 PM", value: "morning" },
  { label: "Afternoon", time: "12 PM – 4 PM", value: "afternoon" },
  { label: "Evening", time: "4 PM – 8 PM", value: "evening" },
  { label: "Night", time: "8 PM – 10 PM", value: "night" },
];

type Props = {
  value: { date: string; slot: string; message: string };
  onBack: () => void;
  onNext: (v: { date: string; slot: string; message: string }) => void;
};

export function DeliveryStep({ value, onBack, onNext }: Props) {
  const [date, setDate] = useState(value.date);
  const [slot, setSlot] = useState(value.slot);
  const [message, setMessage] = useState(value.message);

  const today = new Date();
  const dateOptions = Array.from({ length: 7 }, (_, i) => {
    const d = addDays(today, i);
    return {
      value: format(d, "yyyy-MM-dd"),
      label: i === 0 ? "Today" : i === 1 ? "Tomorrow" : format(d, "EEE d MMM"),
    };
  });

  const canContinue = date && slot;

  return (
    <div className="bg-background border border-border rounded-2xl p-6 space-y-6">
      <h2 className="font-playfair text-xl font-semibold">Delivery Date & Slot</h2>

      {/* Date */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Select Delivery Date</p>
        <div className="grid grid-cols-4 sm:grid-cols-7 gap-2">
          {dateOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setDate(opt.value)}
              className={cn(
                "p-2 rounded-xl border-2 text-xs font-medium transition-all text-center",
                date === opt.value
                  ? "border-primary bg-primary/5 text-primary"
                  : "border-border text-muted-foreground hover:border-primary/40"
              )}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Slot */}
      <div>
        <p className="text-sm font-medium text-foreground mb-3">Select Time Slot</p>
        <div className="grid grid-cols-2 gap-3">
          {slots.map((s) => (
            <button
              key={s.value}
              onClick={() => setSlot(s.value)}
              className={cn(
                "p-3 rounded-xl border-2 text-left transition-all",
                slot === s.value
                  ? "border-primary bg-primary/5"
                  : "border-border hover:border-primary/40"
              )}
            >
              <p className={cn("text-sm font-medium", slot === s.value ? "text-primary" : "text-foreground")}>
                {s.label}
              </p>
              <p className="text-xs text-muted-foreground">{s.time}</p>
            </button>
          ))}
        </div>
      </div>

      {/* Gift message */}
      <div>
        <p className="text-sm font-medium text-foreground mb-2 flex items-center gap-1.5">
          <MessageSquareHeart className="h-4 w-4 text-primary" />
          Gift Message (optional)
        </p>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 150))}
          placeholder="Write a heartfelt message for the recipient..."
          rows={3}
          className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
        />
        <p className="text-xs text-muted-foreground text-right">{message.length}/150</p>
      </div>

      <div className="flex gap-3">
        <Button variant="outline" className="rounded-full" onClick={onBack}>
          <ChevronLeft className="mr-2 h-4 w-4" /> Back
        </Button>
        <Button
          className="flex-1 rounded-full shadow-warm"
          disabled={!canContinue}
          onClick={() => onNext({ date, slot, message })}
        >
          Review Order <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
