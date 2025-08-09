import { ReactNode } from 'react';

export function Card({ className = '', children }: { className?: string; children: ReactNode }) {
  return (
    <div className={`rounded-md border bg-card p-4 text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
}

export function CardHeader({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={`mb-2 ${className}`}>{children}</div>;
}

export function CardTitle({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <h3 className={`font-semibold text-lg ${className}`}>{children}</h3>;
}

export function CardContent({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <div className={className}>{children}</div>;
}

export function CardDescription({
  className = '',
  children,
}: {
  className?: string;
  children: ReactNode;
}) {
  return <p className={`text-muted-foreground text-sm ${className}`}>{children}</p>;
}
