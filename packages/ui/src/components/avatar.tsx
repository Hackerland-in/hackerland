import { cn } from '../cn';
import { TRACK_TONES, type Tone } from '../tokens';
import { toneOutline } from '../tone';

const sizes = {
  sm: 'size-7 text-[0.6875rem]',
  md: 'size-9 text-label-md',
  lg: 'size-12 text-label-lg',
  xl: 'size-24 text-headline-md',
} as const;

const HONORIFICS = new Set(['dr', 'dr.', 'prof', 'prof.', 'mr', 'mr.', 'ms', 'ms.', 'mrs', 'mrs.']);

export function initialsOf(name: string): string {
  const words = name
    .trim()
    .split(/\s+/)
    .filter((word, index, all) => !(index === 0 && all.length > 1 && HONORIFICS.has(word.toLowerCase())));
  const first = words[0]?.[0] ?? '';
  const last = words.length > 1 ? (words[words.length - 1]?.[0] ?? '') : '';
  return (first + last).toUpperCase();
}

function toneFor(name: string): Tone {
  let hash = 0;
  for (const char of name) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  return TRACK_TONES[hash % TRACK_TONES.length] ?? 'neutral';
}

export type AvatarProps = {
  name: string;
  src?: string;
  size?: keyof typeof sizes;
  tone?: Tone;
  className?: string;
};

export function Avatar({ name, src, size = 'md', tone, className }: AvatarProps) {
  const base = cn(
    'inline-flex shrink-0 items-center justify-center overflow-hidden rounded-full border font-display',
    sizes[size],
    className,
  );
  if (src) {
    return <img src={src} alt={name} className={cn(base, 'border-hairline object-cover')} />;
  }
  return (
    <span role="img" aria-label={name} className={cn(base, toneOutline[tone ?? toneFor(name)])}>
      <span aria-hidden>{initialsOf(name)}</span>
    </span>
  );
}

export type AvatarGroupProps = {
  people: { name: string; src?: string }[];
  max?: number;
  size?: AvatarProps['size'];
  className?: string;
};

export function AvatarGroup({ people, max = 4, size = 'sm', className }: AvatarGroupProps) {
  const shown = people.slice(0, max);
  const extra = people.length - shown.length;
  return (
    <div className={cn('flex items-center -space-x-2', className)}>
      {shown.map((person) => (
        <Avatar
          key={person.name}
          name={person.name}
          src={person.src}
          size={size}
          className="ring-2 ring-surface-1"
        />
      ))}
      {extra > 0 ? (
        <span
          aria-label={`${extra} more`}
          className={cn(
            'inline-flex shrink-0 items-center justify-center rounded-full border border-line bg-surface-3 font-display text-fg-muted ring-2 ring-surface-1',
            sizes[size],
          )}
        >
          +{extra}
        </span>
      ) : null}
    </div>
  );
}
