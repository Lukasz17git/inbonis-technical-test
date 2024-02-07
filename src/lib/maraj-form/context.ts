'use client'

import type { ValidTypesAsInputValue } from "./hooks/useFieldController"
import { type FormContent } from "./useForm"
import { createContext } from "react"

type FieldContextValue = undefined | {
   fieldPath: PropertyKey | string
   fieldData: { fieldId: string, descriptionId: string, messageId: string, name: string }
   modifiers?: {
      getFromStore?: (v: any) => ValidTypesAsInputValue
      setToStore?: (v: string) => any
   }
} & FormContent<Record<PropertyKey, any>>

export const FieldContext = createContext<FieldContextValue>(undefined)