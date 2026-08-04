import { z } from "zod";

// ---------- Enums ----------

export const DisputeStatus = z.enum([
  "OPEN",
  "UNDER_REVIEW",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
]);
export type DisputeStatus = z.infer<typeof DisputeStatus>;

export const DisputeReason = z.enum([
  "UNAUTHORIZED_TRANSACTION",
  "DUPLICATE_CHARGE",
  "INCORRECT_AMOUNT",
  "GOODS_NOT_RECEIVED",
  "OTHER",
]);
export type DisputeReason = z.infer<typeof DisputeReason>;

// ---------- Entities ----------

export const TransactionSchema = z.object({
  id: z.string().uuid(),
  merchant: z.string(),
  amount: z.number(),
  // YYYY-MM-DD date string (not a full ISO timestamp)
  currency: z.string().length(3),
  date: z.string().date(),
  category: z.string(),
});
export type Transaction = z.infer<typeof TransactionSchema>;

export const DisputeSchema = z.object({
  id: z.string().uuid(),
  // Human-readable reference shown to customers, e.g. "DP-2026-4821"
  ref: z.string(),
  transactionId: z.string().uuid(),
  reason: DisputeReason,
  description: z.string().min(10).max(1000),
  status: DisputeStatus,
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
});
export type Dispute = z.infer<typeof DisputeSchema>;

// ---------- Request payloads ----------

export const CreateDisputeRequestSchema = z.object({
  transactionId: z.string().uuid(),
  reason: DisputeReason,
  description: z.string().min(10, "Please provide at least 10 characters").max(1000),
});
export type CreateDisputeRequest = z.infer<typeof CreateDisputeRequestSchema>;

export const UpdateDisputeStatusSchema = z.object({
  status: DisputeStatus,
});
export type UpdateDisputeStatusRequest = z.infer<typeof UpdateDisputeStatusSchema>;