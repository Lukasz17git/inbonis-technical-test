import { FieldProvider, type FieldProviderProps } from "@/lib/maraj-form/provider"
import { type DotPaths, type ObjectLiteral, type PrimitivesAndNativeObjects } from "maraj"
import { type HTMLAttributes, type ReactNode } from "react"

type Props<T extends ObjectLiteral, TPath> = HTMLAttributes<HTMLDivElement> & FieldProviderProps<T, TPath>
type FormField<TAllowedTypes = PrimitivesAndNativeObjects> = <T extends ObjectLiteral, TPath extends DotPaths<T, TAllowedTypes>>(props: Props<T, TPath>) => ReactNode

export const FormField: FormField = ({ children, formContent, field, modifiers, ...divProps }) => {
   return (
      <FieldProvider formContent={formContent} field={field} modifiers={modifiers}>
         <div {...divProps}>
            {children}
         </div>
      </FieldProvider>
   )
}