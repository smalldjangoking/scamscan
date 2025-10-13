import * as React from "react";
import {Slot} from "@radix-ui/react-slot";
import {cva} from "class-variance-authority";
import {cn} from "./utils";
import {SearchIcon} from "lucide-react";

const inputVariants = cva(
    "flex min-w-0 rounded-md border px-3 py-1 text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "w-full file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground dark:bg-input/30 border-input bg-input-background file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:border-ring focus-visible:ring-ring/15 focus-visible:ring-[2px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive md:text-sm",
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
                   withIcon = false,
                   ...props
               }) {
    const Comp = asChild ? Slot : "input";

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label htmlFor={label} className="text-muted-foreground max-w-2xl text-lg">
                    {label}
                </label>
            )}

            {/* 👇 Контейнер для иконки и инпута */}
            <div className="relative w-full">
                {withIcon && (
                    <SearchIcon
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none"
                    />
                )}

                <Comp
                    id={label}
                    type={type}
                    data-slot="input"
                    placeholder={placeholder}
                    className={cn(
                        inputVariants({ variant, size }),
                        withIcon && "pl-9",
                        className
                    )}
                    onChange={(e) => callBack?.(e.target.value)}
                    {...props}
                />
            </div>
        </div>
    );
}

export {Input, inputVariants};
export default Input;