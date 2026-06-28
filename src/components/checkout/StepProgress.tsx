const STEPS = ["Delivery", "Gift Message", "Review & Pay"] as const;

export function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0">
      {STEPS.map((label, i) => {
        const step   = i + 1;
        const done   = step < current;
        const active = step === current;
        return (
          <div key={step} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center">
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors ${
                  done   ? "bg-[#D81B60] border-[#D81B60] text-white"
                  : active ? "bg-white border-[#D81B60] text-[#D81B60]"
                  : "bg-white border-gray-300 text-gray-400"
                }`}
              >
                {done ? "✓" : step}
              </div>
              <span
                className={`mt-1 text-[11px] font-medium whitespace-nowrap ${
                  active ? "text-[#D81B60]" : done ? "text-gray-600" : "text-gray-400"
                }`}
              >
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className={`flex-1 h-0.5 mb-4 mx-1 ${done ? "bg-[#D81B60]" : "bg-gray-200"}`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}
