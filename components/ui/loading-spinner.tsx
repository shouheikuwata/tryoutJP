import { cn } from "@/lib/utils/cn";

function LoadingSpinner({ size = "md", className }: { size?: "sm" | "md" | "lg"; className?: string }) {
  const sizeClass = size === "sm" ? "h-4 w-4 border-2" : size === "lg" ? "h-12 w-12 border-[3px]" : "h-8 w-8 border-2";
  return (
    <div
      role="status"
      aria-label="読み込み中"
      className={cn("animate-spin rounded-full border-secondary border-t-primary", sizeClass, className)}
    />
  );
}

export { LoadingSpinner };
