import * as React from "react"
import { cn } from "@/lib/utils"

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: "default" | "outline" | "ghost" | "destructive" | "link"
    size?: "default" | "sm" | "lg" | "icon"
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = "default", size = "default", ...props }, ref) => {
        return (
            <button
                className={cn(
                    "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-2xl text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                    {
                        "bg-red-700 text-white shadow-lg hover:bg-red-800 hover:shadow-xl active:scale-95":
                            variant === "default",
                        "border-2 border-red-700 bg-transparent text-red-700 hover:bg-red-50":
                            variant === "outline",
                        "hover:bg-red-50 hover:text-red-700": variant === "ghost",
                        "bg-red-600 text-white hover:bg-red-700": variant === "destructive",
                        "text-red-700 underline-offset-4 hover:underline": variant === "link",
                    },
                    {
                        "h-11 px-8": size === "default",
                        "h-9 px-4 text-xs": size === "sm",
                        "h-14 px-10 text-base": size === "lg",
                        "h-10 w-10": size === "icon",
                    },
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = "Button"

export { Button }
