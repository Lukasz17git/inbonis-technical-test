import { Slot } from "@radix-ui/react-slot"
import { cn, cnx, createVariant } from "microtailwind-utils"
import { HoverEffect, type AsChild, type Size, type Variant, Aspect } from "./(ui-type-utilities)"
import { type ButtonHTMLAttributes, forwardRef } from "react"

type Ref = HTMLButtonElement
type Props = ButtonHTMLAttributes<Ref>
   & AsChild
   & { asIcon?: boolean }
   & Variant<typeof buttonVariants>
   & Size<typeof buttonSizes>
   & HoverEffect<typeof buttonHoverEffectVariants>
   & Aspect<typeof buttonAspect>

export const buttonHoverEffectVariants = createVariant({
   "primary": 'hover:bg-primary'
})

export const buttonVariants = createVariant({
   "primary": 'bg-black tc-white',
   "outline": 'bc-black bw-1. tc-white',
   'transparent': 'bg-transparent tc-black'
})

export const buttonAspect = createVariant({
   'hexagon': cn(
      "br-0 z-0",
      "before:-z-1 before:content-[''] before:h-[calc(70.71%+0.25rem)] before:aspect-square before:br-8. before:bg-inherit before:pos-a before:l-1. before:rotate-[45deg] before:-translate-x-50% before:-translate-y-[0.5px]",
      "after:-z-1 after:content-[''] after:h-[calc(70.71%+0.25rem)] after:aspect-square after:br-8. after:bg-inherit after:pos-a after:r-1. after:rotate-[45deg] after:translate-x-50% after:-translate-y-[0.5px]",
   )
})

export const buttonSizes = createVariant({
   xsm: 'h-26. min-w-80.',
   xl: 'h-64. min-w-200. ts-18.'
})

export const iconSizes = createVariant({
   xsm: 'w-20. h-20.',
   xl: 'w-40. h-40.'
})

export const Button = forwardRef<Ref, Props>(({
   className,
   asChild = false,
   asIcon = false,
   variant = 'primary',
   size,
   type,
   aspect,
   hoverEffectVariant,
   ...props
}, ref) => {
   const HtmlElement = asChild ? Slot : 'button'
   return (
      <HtmlElement
         ref={ref}
         type={asChild ? type : (type ?? 'button')}
         // ACCESSIBILITY
         data-disabled={props.disabled}
         aria-disabled={props.disabled}
         tabIndex={props.disabled ? -1 : undefined}
         // STYLES
         className={cnx(
            'pos-r h-38. frcc br-6. p-8. tw tw-semibold ts-14.',
            'disabled:pointer-events-none disabled:opacity-50',
            !asIcon && 'min-w-110. max-w-100% px-16.',
            buttonVariants(variant),
            asIcon ? iconSizes(size) : buttonSizes(size),
            buttonHoverEffectVariants(hoverEffectVariant),
            buttonAspect(aspect),
            className
         )}

         // PROPS
         {...props}
      />
   )
})

Button.displayName = "Button"
