import * as React from "react";
import { cn } from "../../lib/utils";

const Button = React.forwardRef(
  ({ className, variant = "default", size = "default", ...props }, ref) => {
    const variants = {
      default: "bg-[#6149CD] text-white hover:bg-[#5039B8]",
      outline: "border border-gray-300 bg-white text-gray-900 hover:bg-gray-50",
      ghost: "hover:bg-gray-100 text-gray-900",
    };

    const sizes = {
      default: "px-6 py-3",
      sm: "px-4 py-2 text-sm",
      lg: "px-8 py-4 text-lg",
    };

    return (
      <button
        className={cn(
          "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-[#6149CD] focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none",
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button };

