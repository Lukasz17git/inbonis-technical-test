import { useContext } from "react"
import { FieldContext } from "../context"

export const useFieldHandlers = <T extends unknown = unknown>() => {
   const fieldContext = useContext(FieldContext)
   if (!fieldContext) throw new Error("useFieldHandlers must be used within a Field component")
   const fieldPath = fieldContext.fieldPath
   const setValue = (newValue: T) => fieldContext?.valuesStore.handlers.updateStateViaPath(fieldPath, newValue)
   return {
      setValue,
   }
}