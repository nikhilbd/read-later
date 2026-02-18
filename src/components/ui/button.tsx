import * as React from "react"
import { cn } from "@/lib/utils"

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'ghost' | 'destructive'
    size?: 'default' | 'sm' | 'icon'
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'default', ...props }, ref) => {
        const variants = {
            primary: "bg-slate-900 text-white hover:bg-slate-800 shadow-sm dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200",
            secondary: "bg-white text-slate-900 border border-slate-200 hover:bg-slate-50 shadow-sm dark:bg-slate-900 dark:text-slate-100 dark:border-slate-800 dark:hover:bg-slate-800",
            ghost: "hover:bg-slate-100 text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100",
            destructive: "bg-red-500 text-white hover:bg-red-600 shadow-sm dark:bg-red-900 dark:hover:bg-red-800",
        }

        const sizes = {
            default: "h-9 px-4 py-2",
            sm: "h-8 px-3 text-xs",
            icon: "h-9 w-9",
        }

        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-950 dark:focus-visible:ring-slate-300 disabled:pointer-events-none disabled:opacity-50",
                    variants[variant],
                    sizes[size],
                    className
                )}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"
