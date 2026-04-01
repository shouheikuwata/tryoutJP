import { forwardRef, type InputHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils/cn";

export interface CheckboxProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: ReactNode;
  error?: string;
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(
  ({ className, label, error, id, ...props }, ref) => (
    <div className="space-y-1">
      <div className="flex items-start gap-2">
        <input
          type="checkbox"
          id={id}
          className={cn(
            "mt-1 h-4 w-4 rounded border-input text-primary focus:ring-primary",
            className
          )}
          ref={ref}
          {...props}
        />
        {label && (
          <label htmlFor={id} className="text-sm leading-relaxed text-foreground">
            {label}
          </label>
        )}
      </div>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
);
Checkbox.displayName = "Checkbox";

export { Checkbox };
