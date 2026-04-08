import { z } from "zod";

export const deliverySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  postalCode: z.string().optional(),
  deliveryNotes: z.string().optional(),
});

// mpesa removed — Paystack handles both M-Pesa and card on their hosted page
export const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "cod"]),
});

const deliveryWithTermsSchema = deliverySchema.extend({
  agreeToTerms: z.boolean().refine((v) => v === true, {
    message: "You must agree to the Terms & Conditions",
  }),
});

export const checkoutSchema = deliveryWithTermsSchema.and(paymentSchema);
