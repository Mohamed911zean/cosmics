// src/lib/currency.ts
//
// Single shared EGP formatter. The whole app (schema, orders, products) uses
// EGP as the currency — this replaces the many hardcoded "$" symbols that
// were scattered across pages, which showed US dollars to Egyptian customers.
//
// Usage: import { formatEGP } from "@/lib/currency"; formatEGP(149.99)
// -> "EGP 149.99" (exact format depends on the browser's Intl implementation,
// typically renders as "EGP 149.99" or "ج.م.‏ 149.99" depending on locale).

const formatter = new Intl.NumberFormat("en-EG", {
  style: "currency",
  currency: "EGP",
  maximumFractionDigits: 2,
})

export function formatEGP(amount: number): string {
  return formatter.format(amount || 0)
}