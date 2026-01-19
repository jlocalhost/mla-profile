import * as React from "react";
import { cn } from "@repo/utils";

const Label = React.forwardRef<
    HTMLLabelElement,
    React.LabelHTMLAttributes<HTMLLabelElement>
>(({ className, ...props }, ref) => (
    <label
        ref={ref}
        className={cn(
            "text-sm font-semibold leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-secondary",
            className
        )}
        {...props}
    />
));
Label.displayName = "Label";

export { Label };
