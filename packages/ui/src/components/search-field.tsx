import { Search } from 'lucide-react';
import { cn } from '../cn';
import { Input, type InputProps } from './input';

export function SearchField({ className, ...props }: InputProps) {
  return (
    <div className={cn('relative min-w-0', className)}>
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-fg-subtle"
      />
      <Input type="search" className="pl-10" {...props} />
    </div>
  );
}
