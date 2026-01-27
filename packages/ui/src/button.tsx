import * as React from "react";
import { cn } from "@repo/utils";

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "primary" | "secondary" | "outline" | "ghost";
    size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "primary", size = "default", ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",
                    variant === "primary" && "bg-blue-600 text-white hover:bg-blue-700",
                    variant === "secondary" && "bg-gray-100 text-gray-900 hover:bg-gray-200",
                    variant === "outline" && "border border-input hover:bg-accent hover:text-accent-foreground",
                    variant === "ghost" && "hover:bg-accent hover:text-accent-foreground",
                    size === "default" && "h-10 py-2 px-4",
                    size === "sm" && "h-9 px-3 rounded-md",
                    size === "lg" && "h-11 px-8 rounded-md",
                    size === "icon" && "h-10 w-10",
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";
