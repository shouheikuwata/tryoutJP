import { cn } from "@/lib/utils/cn";

export default function SectionTitle({
  title,
  subtitle,
  className,
}: {
  title: string;
  subtitle?: string;
  className?: string;
}) {
  return (
    <div className={cn("mb-12 text-center", className)}>
      <h2 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">{title}</h2>
      <div className="mx-auto mt-3 h-0.5 w-12 bg-primary" />
      {subtitle && <p className="mt-4 text-muted-foreground">{subtitle}</p>}
    </div>
  );
}
