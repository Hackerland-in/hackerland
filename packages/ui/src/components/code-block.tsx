import { cn } from '../cn';

export type CodeBlockProps = {
  code: string;
  filename?: string;
  language?: string;
  className?: string;
};

/** Monospace code that scrolls inside itself, never the page. */
export function CodeBlock({ code, filename, language, className }: CodeBlockProps) {
  return (
    <figure
      className={cn('min-w-0 overflow-hidden rounded-lg border border-hairline bg-sunken', className)}
    >
      {filename || language ? (
        <figcaption className="flex items-center justify-between gap-3 border-b border-hairline px-4 py-2">
          <span className="min-w-0 truncate font-mono text-[0.75rem] text-fg-muted">{filename}</span>
          {language ? (
            <span className="shrink-0 font-display text-label-sm uppercase text-fg-subtle">
              {language}
            </span>
          ) : null}
        </figcaption>
      ) : null}
      <pre className="overflow-x-auto p-4 text-[0.8125rem] leading-6">
        <code className="font-mono text-fg">{code}</code>
      </pre>
    </figure>
  );
}
