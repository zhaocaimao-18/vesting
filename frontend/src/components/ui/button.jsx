import * as React from "react"

export const buttonVariants = {
  default: "bg-blue-600 text-white hover:bg-blue-700",
  secondary: "bg-purple-600 text-white hover:bg-purple-700",
  outline: "border border-gray-300 text-gray-800 hover:bg-gray-100",
}

export function Button({ variant = "default", className = "", ...props }) {
  const base =
    "inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  const variantClass = buttonVariants[variant] || buttonVariants.default
  return <button className={`${base} ${variantClass} ${className}`} {...props} />
}
