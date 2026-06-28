"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import type { CheckoutFormData } from "@/app/checkout/page";
import type { Address } from "@/types/order.types";
import { MapPin } from "lucide-react";

const INDIAN_STATES = [
  "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh","Goa","Gujarat",
  "Haryana","Himachal Pradesh","Jharkhand","Karnataka","Kerala","Madhya Pradesh",
  "Maharashtra","Manipur","Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
  "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura","Uttar Pradesh",
  "Uttarakhand","West Bengal",
  "Andaman and Nicobar Islands","Chandigarh","Dadra & Nagar Haveli and Daman & Diu",
  "Delhi","Jammu & Kashmir","Ladakh","Lakshadweep","Puducherry",
];

// Date helpers
function getTodayPlusDays(n: number) {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return d;
}
function formatDate(d: Date) {
  return d.toISOString().split("T")[0];
}
function labelDate(d: Date) {
  if (formatDate(d) === formatDate(new Date())) return "Today";
  if (formatDate(d) === formatDate(getTodayPlusDays(1))) return "Tomorrow";
  return d.toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short" });
}

const SLOTS = [
  { value: "morning",  label: "Morning",  time: "8 AM – 12 PM" },
  { value: "evening",  label: "Evening",  time: "4 PM – 8 PM" },
  { value: "midnight", label: "Midnight", time: "10 PM – 12 AM" },
] as const;

const schema = z.object({
  sender_name:  z.string().min(2, "Your name required"),
  sender_email: z.string().email("Valid email required"),
  sender_phone: z.string().length(10, "Must be 10 digits").regex(/^\d+$/),
  recipient_name:   z.string().min(2, "Recipient name required"),
  recipient_phone:  z.string().length(10, "Must be 10 digits").regex(/^\d+$/),
  delivery_line1:   z.string().min(5, "Enter full address"),
  delivery_line2:   z.string().optional(),
  delivery_city:    z.string().min(2, "City required"),
  delivery_state:   z.string().min(2, "State required"),
  delivery_pincode: z.string().length(6, "6-digit pincode").regex(/^\d+$/),
  delivery_date:    z.string().min(1, "Select a delivery date"),
  delivery_slot:    z.enum(["morning", "evening", "midnight"]),
});

type FieldValues = z.infer<typeof schema>;

interface Props {
  data:            CheckoutFormData;
  isGuest:         boolean;
  savedAddresses:  Address[];
  onNext:          (vals: Partial<CheckoutFormData>) => void;
}

export function DeliveryDetailsStep({ data, isGuest, savedAddresses, onNext }: Props) {
  const dates = Array.from({ length: 7 }, (_, i) => getTodayPlusDays(i));

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FieldValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      sender_name:      data.sender_name,
      sender_email:     data.sender_email,
      sender_phone:     data.sender_phone,
      recipient_name:   data.recipient_name,
      recipient_phone:  data.recipient_phone,
      delivery_line1:   data.delivery_line1,
      delivery_line2:   data.delivery_line2,
      delivery_city:    data.delivery_city,
      delivery_state:   data.delivery_state || INDIAN_STATES[0],
      delivery_pincode: data.delivery_pincode,
      delivery_date:    data.delivery_date || formatDate(getTodayPlusDays(1)),
      delivery_slot:    data.delivery_slot || "morning",
    },
  });

  const selectedDate = watch("delivery_date");
  const selectedSlot = watch("delivery_slot");

  function fillFromSaved(addr: Address) {
    setValue("recipient_name",   addr.recipient_name);
    setValue("recipient_phone",  addr.phone);
    setValue("delivery_line1",   addr.line1);
    setValue("delivery_line2",   addr.line2 ?? "");
    setValue("delivery_city",    addr.city);
    setValue("delivery_state",   addr.state);
    setValue("delivery_pincode", addr.pincode);
  }

  const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
    <div>
      <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
    </div>
  );

  const inputCls = "w-full px-3 py-2.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#D81B60]/20 focus:border-[#D81B60]";

  return (
    <form onSubmit={handleSubmit((v) => onNext(v))} className="space-y-4">
      {/* Sender info (always shown for guests, shown collapsed for logged-in) */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-gray-900">Your Details {isGuest && <span className="text-xs font-normal text-gray-500 ml-1">(for order confirmation)</span>}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Your Name *" error={errors.sender_name?.message}>
            <input {...register("sender_name")} placeholder="Your full name" className={inputCls} />
          </Field>
          <Field label="Your Phone *" error={errors.sender_phone?.message}>
            <input {...register("sender_phone")} type="tel" maxLength={10} placeholder="10-digit mobile" className={inputCls} />
          </Field>
        </div>
        {isGuest && (
          <Field label="Your Email *" error={errors.sender_email?.message}>
            <input {...register("sender_email")} type="email" placeholder="For order confirmation" className={inputCls} />
          </Field>
        )}
        {!isGuest && (
          <input type="hidden" {...register("sender_email")} />
        )}
      </div>

      {/* Saved addresses */}
      {savedAddresses.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
          <h2 className="font-bold text-gray-900 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-[#D81B60]" /> Saved Addresses
          </h2>
          <div className="grid sm:grid-cols-2 gap-2">
            {savedAddresses.map((addr) => (
              <button
                key={addr.id}
                type="button"
                onClick={() => fillFromSaved(addr)}
                className="text-left p-3 rounded-lg border border-gray-200 hover:border-[#D81B60] hover:bg-pink-50 transition-colors text-sm"
              >
                {addr.is_default && <span className="text-[10px] font-bold text-[#D81B60] uppercase bg-pink-100 px-1.5 py-0.5 rounded mr-2">Default</span>}
                <span className="font-medium text-gray-800">{addr.recipient_name}</span>
                <p className="text-gray-500 text-xs mt-0.5 line-clamp-1">{addr.line1}, {addr.city}</p>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Recipient & delivery */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
        <h2 className="font-bold text-gray-900">Recipient & Delivery</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Field label="Recipient Name *" error={errors.recipient_name?.message}>
            <input {...register("recipient_name")} placeholder="Who receives the gift?" className={inputCls} />
          </Field>
          <Field label="Recipient Phone *" error={errors.recipient_phone?.message}>
            <input {...register("recipient_phone")} type="tel" maxLength={10} placeholder="Recipient's mobile" className={inputCls} />
          </Field>
        </div>
        <Field label="Address Line 1 *" error={errors.delivery_line1?.message}>
          <input {...register("delivery_line1")} placeholder="House/Flat no., Street, Area" className={inputCls} />
        </Field>
        <Field label="Address Line 2" error={errors.delivery_line2?.message}>
          <input {...register("delivery_line2")} placeholder="Landmark, Colony (optional)" className={inputCls} />
        </Field>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <Field label="City *" error={errors.delivery_city?.message}>
            <input {...register("delivery_city")} placeholder="City" className={inputCls} />
          </Field>
          <Field label="State *" error={errors.delivery_state?.message}>
            <select {...register("delivery_state")} className={inputCls}>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </Field>
          <Field label="Pincode *" error={errors.delivery_pincode?.message}>
            <input {...register("delivery_pincode")} type="text" maxLength={6} placeholder="6-digit" className={inputCls} />
          </Field>
        </div>
      </div>

      {/* Delivery date */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 className="font-bold text-gray-900">Delivery Date *</h2>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {dates.map((d) => {
            const val = formatDate(d);
            return (
              <button
                key={val}
                type="button"
                onClick={() => setValue("delivery_date", val)}
                className={`shrink-0 px-4 py-2.5 rounded-xl border-2 text-center transition-colors ${
                  selectedDate === val
                    ? "border-[#D81B60] bg-pink-50 text-[#D81B60]"
                    : "border-gray-200 hover:border-gray-400 text-gray-700"
                }`}
              >
                <p className="text-xs font-bold">{labelDate(d)}</p>
                <p className="text-[10px] text-gray-500 mt-0.5">{d.toLocaleDateString("en-IN", { day: "numeric", month: "short" })}</p>
              </button>
            );
          })}
        </div>
        {errors.delivery_date && <p className="text-xs text-red-500">{errors.delivery_date.message}</p>}
      </div>

      {/* Delivery slot */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-3">
        <h2 className="font-bold text-gray-900">Delivery Time Slot *</h2>
        <div className="grid grid-cols-3 gap-3">
          {SLOTS.map((slot) => (
            <button
              key={slot.value}
              type="button"
              onClick={() => setValue("delivery_slot", slot.value)}
              className={`py-3 px-2 rounded-xl border-2 text-center transition-colors ${
                selectedSlot === slot.value
                  ? "border-[#D81B60] bg-pink-50"
                  : "border-gray-200 hover:border-gray-400"
              }`}
            >
              <p className={`text-sm font-bold ${selectedSlot === slot.value ? "text-[#D81B60]" : "text-gray-800"}`}>{slot.label}</p>
              <p className="text-[10px] text-gray-500 mt-0.5">{slot.time}</p>
            </button>
          ))}
        </div>
      </div>

      <button
        type="submit"
        className="w-full bg-[#D81B60] hover:bg-[#C2185B] text-white font-bold py-3.5 rounded-xl transition-colors text-sm"
      >
        Continue to Gift Message →
      </button>
    </form>
  );
}
