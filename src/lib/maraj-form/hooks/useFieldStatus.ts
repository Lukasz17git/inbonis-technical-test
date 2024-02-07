import { useContext } from "react"
import { FieldContext } from "../context"
import { type DotPaths } from "maraj"
import { type FieldStatus } from "../useForm"

export const useFieldStatus = <TStatusInnerKey extends DotPaths<FieldStatus>>(statusKey?: TStatusInnerKey) => {
   const fieldContext = useContext(FieldContext)
   return fieldContext?.statusStore.useStatusStore(state => {
      const status = state[fieldContext.fieldPath]
      return status && statusKey ? status[statusKey] : status
   })
}
