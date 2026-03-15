import { z } from "zod";

import { productMessages } from "@/lib/products/messages";

const launchDateSchema = z
  .string()
  .trim()
  .regex(/^\d{4}-\d{2}-\d{2}$/, productMessages.launchDateInvalid)
  .refine(
    (value) => !Number.isNaN(Date.parse(`${value}T00:00:00.000Z`)),
    productMessages.launchDateInvalid
  );

export const createProductSchema = z.object({
  product_name: z
    .string()
    .trim()
    .min(1, productMessages.productNameRequired)
    .max(80, productMessages.productNameTooLong),
  primary_platform: z
    .array(z.enum(["ios", "android", "web"], { message: productMessages.platformInvalid }))
    .min(1, productMessages.platformRequired),
  launch_date: launchDateSchema,
  business_model: z
    .enum(["B2B SaaS", "B2C Mobile", "Marketplace", "E-commerce"], {
      message: productMessages.businessModelInvalid
    })
    .optional(),
  monetization_type: z
    .array(z.enum(["Subscription", "In-App Purchase", "Ads", "One-time"]))
    .optional(),
  target_audience: z.string().trim().max(200).optional(),
  industry: z.string().trim().max(100).optional(),
  company_stage: z.string().trim().optional(),
  compliance: z.array(z.string()).optional(),
  uvp: z.string().trim().max(280).optional(),
  competitors: z.array(z.string()).optional()
});

export const updateProductSchema = z.object({
  launch_date: launchDateSchema.optional(),
  business_model: z
    .enum(["B2B SaaS", "B2C Mobile", "Marketplace", "E-commerce"])
    .optional(),
  monetization_type: z
    .array(z.enum(["Subscription", "In-App Purchase", "Ads", "One-time"]))
    .optional(),
  target_audience: z.string().trim().max(200).optional(),
  primary_platform: z
    .array(z.enum(["ios", "android", "web"]))
    .min(1)
    .optional(),
  industry: z.string().trim().max(100).optional(),
  company_stage: z.string().trim().optional(),
  compliance: z.array(z.string()).optional(),
  uvp: z.string().trim().max(280).optional(),
  competitors: z.array(z.string()).optional()
});

export type CreateProductInput = z.infer<typeof createProductSchema>;
export type UpdateProductInput = z.infer<typeof updateProductSchema>;
