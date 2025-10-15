import * as React from "react";
import {Slot} from "@radix-ui/react-slot";
import {cva} from "class-variance-authority";
import {cn} from "./utils";

const inputVariants = cva(
    "flex min-w-0 rounded-md border text-base transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed",
    {
        variants: {
            variant: {
                default: "w-full flex items-center rounded-md border dark:border-input bg-input-background dark:bg-input/30 pl-2 text-sm text-black dark:text-white font-medium placeholder:text-sidebar-ring selection:bg-primary selection:text-primary-foreground outline-none transition-colors focus:ring-1 focus:ring-primary disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50",
            },
            size: {
                default: "min-h-0 h-10",
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
                   icon: Icon,
                   ...props
               }) {
    const Comp = asChild ? Slot : "input";

    return (
        <div className="flex flex-col gap-1 w-full">
            {label && (
                <label
                    htmlFor={label}
                    className="text-muted-foreground max-w-2xl text-lg"
                >
                    {label}
                </label>
            )}

            {/* 👇 Контейнер для иконки и инпута */}
            <div className="relative w-full p-[1px] overflow-visible">
                {Icon && (
                    <Icon
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4 pointer-events-none"
                    />
                )}

                <Comp
                    id={label}
                    type={type}
                    data-slot="input"
                    placeholder={placeholder}
                    className={cn(
                        inputVariants({ variant, size }),
                        Icon && "pl-10",
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