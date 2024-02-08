import type { Prettify } from "@/(utility-types)";
import { forEachEntry, type ObjectLiteral, } from "maraj";
import equal from 'react-fast-compare'

export type PartialKeepingSomeFields<
   TObj extends ObjectLiteral,
   TKeysToKeep extends (keyof TObj | 'id')[]
> = Prettify<{
   [Key in Exclude<keyof TObj, Exclude<keyof TObj, TKeysToKeep[number]>>]: TObj[Key]
} & {
      [Key in Exclude<keyof TObj, TKeysToKeep[number]>]?: TObj[Key]
   }>

export const extractChangedFields = <T extends ObjectLiteral, TKeysToKeep extends (keyof T | 'id')[]>(
   original: T,
   updates: T,
   keysToKeep: TKeysToKeep
): PartialKeepingSomeFields<T, TKeysToKeep> => {

   const changes: PartialKeepingSomeFields<T, TKeysToKeep> = {} as PartialKeepingSomeFields<T, TKeysToKeep>

   forEachEntry(updates, (keyInUpdate, valueInUpdate) => {
      if (keysToKeep.includes(keyInUpdate)) {
         // @ts-expect-error: must be a valid key
         changes[keyInUpdate] = valueInUpdate
         return
      }
      const originalValue = original[keyInUpdate]
      if (equal(originalValue, valueInUpdate)) return
      // @ts-expect-error: must be a valid key
      changes[keyInUpdate] = valueInUpdate
   })

   return changes
}