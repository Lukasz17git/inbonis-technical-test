'use client'

import { cnx, createVariant, type VariantAsProp } from "microtailwind-utils"
import { type InputHTMLAttributes, forwardRef, HTMLInputTypeAttribute, } from "react"
import { useFieldController } from "@/lib/maraj-form/hooks/useFieldController"
import { type Variant } from "./(ui-type-utilities)"

type Ref = HTMLInputElement
type InputProps = InputHTMLAttributes<Ref>
   & Variant<typeof inputVariants>
   & VariantAsProp<typeof maxWidthVariants, "maxWidth">

export const inputVariants = createVariant({
   default: `bc-default shadow-sm bg-neutral-400/1 d:bg-neutral-400/1`,
})

const maxWidthVariants = createVariant({
   xsm: 'max-w-150.',
   sm: 'max-w-200.',
   md: 'max-w-250.',
   lg: 'max-w-300.'
})

export const Input = forwardRef<Ref, InputProps>(({
   className,
   type,
   required,
   onChange,
   onBlur,
   variant,
   maxWidth = 'md',
   ...props
}, ref) => {
   const { controllerProps, fieldId, fieldName, error, descriptionId, messageId, status } = useFieldController(onChange, onBlur)
   const inputTypeAddedAutomaticallyIfForgotten = type ?? automaticallyAppliedInputTypes[fieldName ?? ''] ?? 'text'
   // const isInvalid = status?.isDirty && error
   // const isRequired = required
   return (
      <input
         ref={ref}
         type={inputTypeAddedAutomaticallyIfForgotten}
         // ACCESSIBILITY
         data-disabled={props.disabled}
         aria-disabled={props.disabled}
         // STYLES
         className={cnx(
            'pos-r flex h-38. w-100% max-w-280. px-12. br-5. ts-14. bw-1. bg-transparent',
            'placeholder:tc-inherit placeholder:tf-[inherit] placeholder:ts-[inherit] placeholder:opacity-70 d:placeholder:opacity-80',
            'peer',
            'tc-black',
            inputVariants(variant),
            maxWidthVariants(inputTypeAddedAutomaticallyIfForgotten === 'email' ? 'lg' : maxWidth),
            className
         )}
         // CONTROLL ACCESSIBILITY
         id={fieldId}
         name={fieldName}
         aria-invalid={!!error}
         aria-describedby={error ? `${descriptionId} ${messageId}` : descriptionId}
         // PROPS
         {...controllerProps}
         {...props}
      />
   )
})

Input.displayName = "Input"


/**
 * This is a list of input types that are automatically applied to inputs based on their name.
 * It only applies it if the type is forgotten to set.
 */
const automaticallyAppliedInputTypes: Record<string, HTMLInputTypeAttribute> = {
   email: 'email',
   correo: 'email',
   password: 'password',
   contraseña: 'password',
   confirmPassword: 'password',
   confirmarContraseña: 'password',
   repeatPassword: 'password',
   repetirContraseña: 'password',
}