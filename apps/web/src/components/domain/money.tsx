import { formatMoney, type Currency } from '@hackerland/core';
import { cn } from '@hackerland/ui';

export interface MoneyProps {
  amount: number;
  currency: Currency;
  className?: string;
}

export function Money({ amount, currency, className }: MoneyProps) {
  return (
    <span className={cn('tabular font-mono', className)}>
      {formatMoney(amount, currency)}
    </span>
  );
}
