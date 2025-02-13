import * as React from "react"
import { cn } from "../../lib/utils"
import { Slot } from "@radix-ui/react-slot";


const Button = React.forwardRef(({ 
  className, 
  variant = "default", 
  size = "default", 
  asChild = false,
  ...props 
}, ref) => {
  const Comp = asChild ? Slot : "button";
  
  return (
    <Comp
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-gray-950",
        "disabled:pointer-events-none disabled:opacity-50",
        {
          "bg-gray-900 text-gray-50 shadow hover:bg-gray-900/90": variant === "default",
          "bg-red-500 text-white shadow-sm hover:bg-red-600": variant === "destructive",
          "border border-gray-200 bg-white shadow-sm hover:bg-gray-100 hover:text-gray-900": variant === "outline",
          "hover:bg-gray-100 hover:text-gray-900": variant === "ghost",
          "bg-gray-100 text-gray-900 shadow-sm hover:bg-gray-200": variant === "secondary",
          "h-9 px-4 py-2": size === "default",
          "h-8 rounded-md px-3 text-xs": size === "sm",
          "h-11 rounded-md px-8": size === "lg",
          "h-9 w-9": size === "icon",
        },
        className
      )}
      ref={ref}
      {...props}
    />
  )
})
Button.displayName = "Button"

export { Button }