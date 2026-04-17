import { z } from "zod";

export const deliverySchema = z
  .object({
    fullName: z.string().min(2, "Full name is required"),
    phone: z
      .string()
      .min(9, "Valid phone number required")
      .max(10, "Valid phone number required"),
    fulfillmentMethod: z.enum(["home_delivery", "pickup"]),
    location: z.string().optional(),
    additionalInfo: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    if (
      data.fulfillmentMethod === "home_delivery" &&
      (!data.location || data.location.trim().length < 2)
    ) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["location"],
        message: "Location is required for home delivery",
      });
    }
  });

export const paymentSchema = z.object({
  paymentMethod: z.enum(["card", "cod"]),
});

const deliveryWithTermsSchema = deliverySchema.extend({
  agreeToTerms: z.boolean().refine((v) => v === true, {
    message: "You must agree to the Terms & Conditions",
  }),
});

export const checkoutSchema = deliveryWithTermsSchema.and(paymentSchema);
