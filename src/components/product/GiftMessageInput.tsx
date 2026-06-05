"use client";
import { useState } from "react";
import { MessageSquareHeart } from "lucide-react";

type Props = { value: string; onChange: (v: string) => void };

const MAX = 150;

export function GiftMessageInput({ value, onChange }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <div>
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <MessageSquareHeart className="h-4 w-4" />
        {open ? "Remove gift message" : "Add a gift message (free)"}
      </button>
      {open && (
        <div className="mt-2">
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value.slice(0, MAX))}
            placeholder="Write a heartfelt message for your loved one..."
            rows={3}
            className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary placeholder:text-muted-foreground"
          />
          <p className="text-xs text-muted-foreground text-right mt-1">
            {value.length}/{MAX}
          </p>
        </div>
      )}
    </div>
  );
}
