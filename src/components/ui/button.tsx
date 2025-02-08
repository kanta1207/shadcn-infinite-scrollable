import { cn } from '@/lib/utils'

import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import * as React from 'react'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md font-semibold transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-30 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-primary/90 rounded-full bg-primary text-primary-foreground shadow',
        destructive: 'hover:bg-destructive/90 rounded-full bg-destructive text-destructive-foreground shadow-sm',
        outline: 'rounded-full border border-primary bg-background text-primary shadow-sm hover:opacity-80',
        secondary: 'hover:bg-secondary/80 rounded-full bg-secondary text-secondary-foreground shadow-sm',
        accent: 'hover:bg-accent/80 rounded-full bg-accent text-accent-foreground shadow-sm',
        ghost: 'rounded-full hover:bg-accent hover:text-accent-foreground',
        link: 'rounded-full text-primary underline-offset-4 hover:underline'
      },
      size: {
        default: 'h-9 px-4 py-2',
        sm: 'h-8 px-3 text-xs',
        lg: 'h-10 px-8',
        xl: 'h-12 px-10',
        icon: 'size-9'
      }
    },
    defaultVariants: {
      variant: 'default',
      size: 'default'
    }
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
