import { z } from "zod";
const kenyaPhoneRegex = /^(?:\+254|254|0)?7\d{8}$/;

export const deliverySchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  email: z.string().email("Invalid email"),
  address: z.string().min(5, "Address required"),
  city: z.string().min(2, "City required"),
  postalCode: z.string().optional(),
  deliveryNotes: z.string().optional(),
});



export const paymentSchema = z
  .object({
    paymentMethod: z.enum(["mpesa", "card", "cod"]),
    mpesaPhone: z
      .string()
      .min(1, "M-Pesa phone number is required")
      .regex(kenyaPhoneRegex, "Enter a valid Kenyan phone number"),
    cardNumber: z.string().optional(),
    cardExpiry: z.string().optional(),
    cardCVV: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    const isBlank = (v?: string) => !v || v.trim().length === 0;

    if (data.paymentMethod === "card") {
      if (isBlank(data.cardNumber)) {
        ctx.addIssue({
          path: ["cardNumber"],
          message: "Card number is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (isBlank(data.cardExpiry)) {
        ctx.addIssue({
          path: ["cardExpiry"],
          message: "Expiry date is required",
          code: z.ZodIssueCode.custom,
        });
      }
      if (isBlank(data.cardCVV)) {
        ctx.addIssue({
          path: ["cardCVV"],
          message: "CVV is required",
          code: z.ZodIssueCode.custom,
        });
      }
    }
  });

const deliveryWithTermsSchema = deliverySchema.extend({
    agreeToTerms: z
      .boolean()
      .refine((v) => v === true, { message: "You must agree to the Terms & Conditions" }),
});

  export const checkoutSchema = deliveryWithTermsSchema.and(paymentSchema);

  
