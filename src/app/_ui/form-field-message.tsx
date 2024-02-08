'use client'

import { type HTMLAttributes, forwardRef } from "react"
import { cnx } from "microtailwind-utils"
import { useFieldData } from "@/lib/maraj-form/hooks/useFieldData"
import { useFieldError } from "@/lib/maraj-form/hooks/useFieldError"
import { useFieldStatus } from "@/lib/maraj-form/hooks/useFieldStatus"
import type { OmitKeys } from "@/(utility-types)"
import { useFieldValue } from "@/lib/maraj-form/hooks/useFieldValue"


type Ref = HTMLParagraphElement
type Props = OmitKeys<HTMLAttributes<Ref>, 'role' | 'id'> & {
   requiredMessage?: string
}

export const FormFieldMessage = forwardRef<Ref, Props>(({ className, children, requiredMessage, ...props }, ref) => {

   const fieldData = useFieldData()
   const error = useFieldError()
   const isDirty = useFieldStatus('isDirty')
   const value = useFieldValue()

   const isFieldInvalid = error && isDirty
   const isFieldRequired = requiredMessage && !value

   // return nothing if there is no field description, error or required message.
   if (!isFieldInvalid && !isFieldRequired && !children) return

   // children to show
   let childrenToShow = children
   if (isFieldInvalid) childrenToShow = error
   if (isFieldRequired) childrenToShow = requiredMessage

   return (
      <span
         ref={ref}
         // MESSAGE ID
         id={fieldData?.messageId}
         // ACCESSIBILITY
         role={(isFieldInvalid || isFieldRequired) ? "alert" : undefined}
         // STYLES
         className={cnx(
            "ts-12. tw-medium tc-default duration-200",
            isFieldInvalid && 'tc-font-invalid',
            isFieldRequired && 'tc-font-invalid',
            className,
         )}
         {...props}
      >
         {childrenToShow}
      </span>
   )
})

FormFieldMessage.displayName = "FieldMessage"