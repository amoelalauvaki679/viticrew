import { type SelectHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Select = forwardRef<
  HTMLSelectElement,
  SelectHTMLAttributes<HTMLSelectElement>
>(({ className, children, ...props }, ref) => (
  <select
    ref={ref}
    className={cn(
      "h-11 w-full appearance-none rounded-md border border-input bg-card bg-[length:12px] bg-[right_12px_center] bg-no-repeat px-3 pr-9 text-sm text-foreground",
      "bg-[url('data:image/svg+xml;utf8,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%2212%22 height=%228%22 fill=%22none%22><path stroke=%22%238b9aa3%22 stroke-width=%221.5%22 d=%22M1 1.5 6 6.5 11 1.5%22/></svg>')]",
      "transition-[box-shadow] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      className,
    )}
    {...props}
  >
    {children}
  </select>
));
Select.displayName = "Select";
