import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";
import { cn } from "./utils";

const inputVariants = cva(
    "flex w-full min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input bg-input-background file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive md:text-sm",
            },
            size: {
                default: "h-9",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
);

function Input({
    className,
    variant,
    size,
    asChild = false,
    type,
    label,
    placeholder,
    callBack,
    ...props
}) {
    const Comp = asChild ? Slot : "input";

    return (
        <>
            {label && (
                <label htmlFor={label} className="text-lg font-medium tracking-wider text-foreground">
                    {label}
                </label>
            )}
            <Comp
                id={label}
                type={type}
                data-slot="input"
                placeholder={placeholder}
                className={cn(inputVariants({ variant, size, className }))}
                onChange={(e) => callBack?.(e.target.value)}
                {...props}
            />
        </>
    );
}

export { Input, inputVariants };
export default Input;