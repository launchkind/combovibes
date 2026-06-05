"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { addressSchema, type AddressInput } from "@/lib/validations/checkout";
import { ChevronRight } from "lucide-react";

type Props = {
  defaultValues?: Partial<AddressInput>;
  onNext: (data: AddressInput) => void;
};

const INDIAN_STATES = [
  "Andhra Pradesh", "Assam", "Bihar", "Delhi", "Goa", "Gujarat", "Haryana",
  "Himachal Pradesh", "Jharkhand", "Karnataka", "Kerala", "Madhya Pradesh",
  "Maharashtra", "Odisha", "Punjab", "Rajasthan", "Tamil Nadu", "Telangana",
  "Uttar Pradesh", "Uttarakhand", "West Bengal",
];

export function AddressStep({ defaultValues, onNext }: Props) {
  const { register, handleSubmit, formState: { errors } } = useForm<AddressInput>({
    resolver: zodResolver(addressSchema),
    defaultValues,
  });

  return (
    <div className="bg-background border border-border rounded-2xl p-6">
      <h2 className="font-playfair text-xl font-semibold mb-5">Delivery Address</h2>
      <form onSubmit={handleSubmit(onNext)} className="space-y-4">
        <div className="grid sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Full Name *</Label>
            <Input id="name" placeholder="Priya Sharma" {...register("name")} />
            {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="phone">Mobile Number *</Label>
            <div className="flex gap-2">
              <span className="flex items-center px-3 bg-muted border border-input rounded-md text-sm text-muted-foreground shrink-0">+91</span>
              <Input id="phone" type="tel" placeholder="98765 43210" {...register("phone")} className="flex-1" />
            </div>
            {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="line1">Address Line 1 *</Label>
          <Input id="line1" placeholder="Flat / House No., Building, Street" {...register("line1")} />
          {errors.line1 && <p className="text-xs text-destructive">{errors.line1.message}</p>}
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="line2">Address Line 2 (optional)</Label>
          <Input id="line2" placeholder="Area, Landmark" {...register("line2")} />
        </div>

        <div className="grid sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="city">City *</Label>
            <Input id="city" placeholder="Mumbai" {...register("city")} />
            {errors.city && <p className="text-xs text-destructive">{errors.city.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="state">State *</Label>
            <select
              id="state"
              {...register("state")}
              className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">Select state</option>
              {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
            {errors.state && <p className="text-xs text-destructive">{errors.state.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="pincode">Pincode *</Label>
            <Input id="pincode" placeholder="400001" maxLength={6} {...register("pincode")} />
            {errors.pincode && <p className="text-xs text-destructive">{errors.pincode.message}</p>}
          </div>
        </div>

        <Button type="submit" className="w-full rounded-full shadow-warm mt-2">
          Continue to Delivery <ChevronRight className="ml-2 h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
