'use client'

import { cnx, createVariant } from "microtailwind-utils"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { type ComponentPropsWithoutRef, type ElementRef, forwardRef } from "react"
import { HoverEffect, Variant } from "./(ui-type-utilities)"

const linkVariants = createVariant({
   "default": "tc-black",
   "grey": 'tc-font-grey',
   "primary": 'tc-primary',
   "primary-pastel": 'tc-primary-pastel',
})

const linkHoverEffectVariants = createVariant({
   "default": '',
   "primary": 'hover:tc-primary',
})

type Ref = ElementRef<typeof Link>
type Props = ComponentPropsWithoutRef<typeof Link>
   & Variant<typeof linkVariants>
   & HoverEffect<typeof linkHoverEffectVariants>

export const AppLink = forwardRef<Ref, Props>(({
   href,
   prefetch = false,
   className,
   variant,
   hoverEffectVariant,
   ...props
}, ref) => {
   const pathname = usePathname()
   const newHref = (typeof href !== 'string' || href.startsWith('/')) ? href : `${pathname}/${href}`
   return (
      <Link
         ref={ref}
         // DISABLE PREFETCH
         prefetch={prefetch}
         href={newHref}
         // STYLES
         className={cnx(
            linkVariants(variant),
            linkHoverEffectVariants(hoverEffectVariant),
            className
         )}
         {...props}
      />
   )
})
AppLink.displayName = "AppLink"