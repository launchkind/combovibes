import { z } from "zod";

export const emailOtpSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
});

export const otpVerifySchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits").regex(/^\d+$/, "OTP must be numeric"),
});

export const profileSchema = z.object({
  fullName: z.string().min(2, "Name must be at least 2 characters"),
  phone: z
    .string()
    .length(10, "Phone must be 10 digits")
    .regex(/^\d+$/, "Phone must contain only numbers")
    .optional(),
  dateOfBirth: z.date().optional(),
  anniversaryDate: z.date().optional(),
});

export type EmailOtpInput = z.infer<typeof emailOtpSchema>;
export type OtpVerifyInput = z.infer<typeof otpVerifySchema>;
export type ProfileInput = z.infer<typeof profileSchema>;
