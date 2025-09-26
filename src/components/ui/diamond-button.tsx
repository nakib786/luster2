import * as React from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface DiamondButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  variant?: "primary" | "secondary" | "gradient"
  size?: "sm" | "md" | "lg"
  className?: string
}

const DiamondButton = React.forwardRef<HTMLButtonElement, DiamondButtonProps>(
  ({ children, variant = "gradient", size = "md", className, ...props }, ref) => {
    const baseClasses = "relative font-semibold transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50"
    
    const variantClasses = {
      primary: "bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white shadow-lg hover:shadow-blue-500/25",
      secondary: "bg-gradient-to-br from-slate-700 via-slate-800 to-slate-900 text-white shadow-lg hover:shadow-slate-500/25",
      gradient: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white shadow-2xl hover:shadow-purple-500/25"
    }
    
    const sizeClasses = {
      sm: "h-10 px-6 py-2 text-sm",
      md: "h-12 px-8 py-3 text-base",
      lg: "h-14 px-10 py-4 text-lg"
    }

    return (
      <motion.button
        ref={ref}
        className={cn(
          baseClasses,
          variantClasses[variant],
          sizeClasses[size],
          "transform hover:scale-105 active:scale-95",
          className
        )}
        style={{
          clipPath: "polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)",
        }}
        whileHover={{ 
          scale: 1.05,
          boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04), 0 0 0 1px rgba(147, 51, 234, 0.1)"
        }}
        whileTap={{ scale: 0.95 }}
        transition={{ 
          type: "spring", 
          stiffness: 400, 
          damping: 17 
        }}
        {...props}
      >
        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent opacity-0"
          animate={{ 
            opacity: [0, 1, 0],
            x: ["-100%", "100%"]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            repeatDelay: 3,
            ease: "easeInOut"
          }}
          style={{
            clipPath: "polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)",
          }}
        />
        
        {/* Content */}
        <span className="relative z-10 flex items-center justify-center gap-2">
          {children}
        </span>
        
        {/* Hover glow effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent opacity-0"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          style={{
            clipPath: "polygon(20% 0%, 80% 0%, 100% 50%, 80% 100%, 20% 100%, 0% 50%)",
          }}
        />
      </motion.button>
    )
  }
)

DiamondButton.displayName = "DiamondButton"

export { DiamondButton }
