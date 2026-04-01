import Link from "next/link";
import { cn } from "@/lib/utils/cn";

export default function CTAButton({
  href,
  children,
  variant = "primary",
  className,
}: {
  href: string;
  children: React.ReactNode;
  variant?: "primary" | "outline";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-8 py-3 text-sm font-medium transition-colors",
        variant === "primary"
          ? "bg-primary text-white hover:bg-primary/90"
          : "border border-primary text-primary hover:bg-primary hover:text-white",
        className
      )}
    >
      {children}
    </Link>
  );
}
