import { type VariantAsProp } from "microtailwind-utils"

/**
 * A type utility to indicate if a component should use the slot of its child component or not.
 */
export type AsChild = { asChild?: boolean }

/**
 * A type utility to indicate the variant of a component while being consistent with the prop name.
 */
export type Variant<T> = VariantAsProp<T, 'variant'>

/**
 * A type utility to indicate the size of a component while being consistent with the prop name.
 */
export type Size<T> = VariantAsProp<T, 'size'>

/**
 * A type utility to indicate the hover effect of a component while being consistent with the prop name.
 */
export type HoverEffect<T> = VariantAsProp<T, 'hoverEffectVariant'>


/**
 * A type utility to indicate the aspect of a component while being consistent with the prop name.
 */
export type Aspect<T> = VariantAsProp<T, 'aspect'>