import { type ObjectLiteral, forEachEntry, isObjectLiteral } from "maraj";
import equal from 'react-fast-compare'

export type DeepPartial<T extends ObjectLiteral> = {
   [K in keyof T]?: T[K] extends ObjectLiteral ? DeepPartial<T[K]> : T[K];
};

export const extractDeepChangedFields = <T extends ObjectLiteral>(original: T, updates: T): DeepPartial<T> => {

   const changes: DeepPartial<T> = {}

   forEachEntry(updates, (keyInUpdate, valueInUpdate) => {
      const originalValue = original[keyInUpdate]
      if (equal(originalValue, valueInUpdate)) return
      const isValueInKeyAnObjectLiteral = isObjectLiteral(originalValue) && isObjectLiteral(valueInUpdate)
      //@ts-expect-error: changes[key] type is PartialDeep if both originalValue and valueInUpdate are objectLiterals.
      changes[keyInUpdate] = isValueInKeyAnObjectLiteral ? extractDeepChangedFields(originalValue, valueInUpdate) : valueInUpdate
   })

   return changes
}