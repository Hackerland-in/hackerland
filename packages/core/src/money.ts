import { z } from 'zod';

export const CURRENCIES = ['INR', 'USD', 'EUR'] as const;
export type Currency = (typeof CURRENCIES)[number];
export const currencySchema = z.enum(CURRENCIES);

const formatters: Record<Currency, Intl.NumberFormat> = {
  INR: new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }),
  USD: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }),
  EUR: new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR',
    maximumFractionDigits: 0,
  }),
};

/** Formats a whole-unit amount, e.g. `₹1,50,000`, `$500`, `€2,000`. */
export function formatMoney(amount: number, currency: Currency): string {
  return formatters[currency].format(amount);
}
