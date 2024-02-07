import type { HTMLInputTypeAttribute } from "react"
import { type ValidTypesAsInputValue } from "./useFieldController"

type Modifier = {
   gettingFromStore: (v: any) => ValidTypesAsInputValue
   settingToStore?: (v: string) => any
}

const formDefaultModifiers = {
   string: {
      gettingFromStore: (v: string) => v,
      settingToStore: (v: string) => v
   },
   number: {
      gettingFromStore: (v: number) => v,
      settingToStore: (v: string) => parseFloat(v)
   },
   boolean: {
      gettingFromStore: (v: boolean) => v,
      settingToStore: () => (valueInStore: boolean) => !valueInStore
   },
   date: {
      gettingFromStore: (v: Date) => `${v.getFullYear()}-${`0${v.getMonth() + 1}`.slice(-2)}-${`0${v.getDate()}`.slice(-2)}`,
      settingToStore: (v: string) => new Date(v)
   },
   unknown: {
      gettingFromStore: () => '',
      settingToStore: undefined
   }
} satisfies Record<string, Modifier>


export const getDefaultModifiers = (value: unknown) => {
   if (typeof value === 'string') return formDefaultModifiers.string
   else if (typeof value === 'number') return formDefaultModifiers.number
   else if (typeof value === 'boolean') return formDefaultModifiers.boolean
   else if (value instanceof Date) return formDefaultModifiers.date
   else if (!value) return formDefaultModifiers.unknown
   else throw new Error(`Value inside field is not a primitive: ${JSON.stringify(value)} . Please provide a modifier to be able to handle this non-primitive value.`)
}

type ValidFieldControllerTypeAttributes = HTMLInputTypeAttribute | undefined | 'toggle'
export const getUnknownSetterModifier = (type: ValidFieldControllerTypeAttributes) => {
   if (type === 'number' || type === 'range') return formDefaultModifiers.number.settingToStore
   else if (type === 'toggle' || type === 'checkbox' || type === 'radio') return formDefaultModifiers.boolean.settingToStore
   else if (type === 'date' || type === 'datetime-local' || type === 'month' || type === 'time' || type === 'week') return formDefaultModifiers.date.settingToStore
   else return formDefaultModifiers.string.settingToStore
}