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
  variant?: "primary" | "outline" | "primary-light" | "outline-light";
  className?: string;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "inline-flex items-center justify-center rounded-md px-8 py-3 text-sm font-medium transition-colors",
        variant === "primary" && "bg-primary text-white hover:bg-primary/90",
        variant === "outline" && "border border-primary text-primary hover:bg-primary hover:text-white",
        variant === "primary-light" && "bg-white text-primary hover:bg-white/90",
        variant === "outline-light" && "border border-white text-white hover:bg-white hover:text-primary",
        className
      )}
    >
      {children}
    </Link>
  );
}
