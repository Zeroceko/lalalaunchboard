import Link from "next/link";

interface WorkspaceNoticeProps {
  eyebrow: string;
  title: string;
  description: string;
  actionHref?: string;
  actionLabel?: string;
}

export function WorkspaceNotice({
  eyebrow,
  title,
  description,
  actionHref,
  actionLabel
}: WorkspaceNoticeProps) {
  return (
    <div className="rounded-[2rem] border border-dashed border-foreground/15 bg-white/82 p-8 shadow-[0_24px_60px_rgba(15,23,42,0.06)] backdrop-blur">
      <p className="text-sm font-semibold uppercase tracking-[0.22em] text-primary/80">
        {eyebrow}
      </p>
      <h1 className="mt-3 max-w-3xl text-4xl font-semibold tracking-tight text-balance">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-7 text-muted-foreground">
        {description}
      </p>
      {actionHref && actionLabel ? (
        <Link
          href={actionHref}
          className="mt-6 inline-flex rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-95"
        >
          {actionLabel}
        </Link>
      ) : null}
    </div>
  );
}
