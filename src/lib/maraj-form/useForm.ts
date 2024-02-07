import { type FormEvent, useMemo, useEffect } from "react"
import { useCreateComponentStore, useCreateDotPathRecordComponentStore } from "../maraj-store"
import { type DotPaths, type ObjectLiteral } from "maraj"
import { extractChangedFields, type PartialKeepingSomeFields } from "./extractChangedFields"

/* Subscribe Functions to listen on values changes */
export type FormSubscription<T extends ObjectLiteral> = (valuesState: T, formContent: FormContent<T>) => void

/* Status Store */
export type FieldStatus = { isDirty?: boolean, changedValue?: boolean }
type FormStatusStore<T> = { [K in DotPaths<T>]?: FieldStatus }

/* Errors Store */
export type FormErrorStore<T> = { [K in DotPaths<T>]?: string }

/* Form Content */
export type FormContent<T extends ObjectLiteral> = ReturnType<typeof useForm<T>>['formContent']

/* Form Props */
type Props<
   TState extends ObjectLiteral,
   TKeysToKeep extends (keyof TState | 'id')[] = 'id'[]
> = {
   subscribe?: FormSubscription<TState> | FormSubscription<TState>[],
   defaultValues: TState,
   keysToKeep?: TKeysToKeep
}

export const useForm = <
   TState extends ObjectLiteral,
   TKeysToKeep extends (keyof TState | 'id')[] = 'id'[]
>({ subscribe, defaultValues, keysToKeep }: Props<TState, TKeysToKeep>) => {

   const subscriptions = subscribe ? (Array.isArray(subscribe) ? subscribe : [subscribe]) : undefined

   const content = useMemo((() => {
      const valuesStore = useCreateComponentStore('Values', defaultValues)
      const errorsStore = useCreateDotPathRecordComponentStore('Errors', {} as FormErrorStore<TState>)
      const statusStore = useCreateDotPathRecordComponentStore('Status', {} as FormStatusStore<TState>)
      const formContent = { valuesStore, errorsStore, statusStore }

      /* Reset Form */
      const resetForm = () => {
         valuesStore.handlers.setState(() => defaultValues, true)
         errorsStore.handlers.setState(() => ({}), true)
         statusStore.handlers.setState(() => ({}), true)
      }

      /* Submit Handler */
      const submitHandler = (handler: (values: TState, changedValues: PartialKeepingSomeFields<TState, TKeysToKeep> & {}, formEvent: FormEvent<HTMLFormElement>) => void | Promise<void>) => (e: FormEvent<HTMLFormElement>) => {
         e.preventDefault()
         const state = valuesStore.handlers.getState()
         const changes = extractChangedFields(defaultValues, state, keysToKeep ?? ['id'] as TKeysToKeep)
         return handler(state, changes, e)
      }

      /* Check if form is valid */
      const useIsFormValid = (): boolean => errorsStore.useErrorsStore(state => !Object.keys(state).length)

      /* Subscriptions */
      if (subscriptions) {
         subscriptions.forEach(subscription => valuesStore.handlers.subscribe(s => subscription(s, formContent)))
         // subscriptions.forEach(subscription => subscription(valuesStore.handlers.getState(), formContent))
      }

      return {
         formContent,
         resetForm,
         submitHandler,
         useIsFormValid,
      }
   }), [])

   /* Run subscriptions on mount */
   useEffect(() => {
      if (subscriptions) subscriptions.forEach(subscription => subscription(content.formContent.valuesStore.handlers.getState(), content.formContent))
   }, [])

   /* Check if form is valid */
   const { useIsFormValid, ...contentWithoutUseIsFormValid } = content
   const isFormValid = useIsFormValid()

   return {
      ...contentWithoutUseIsFormValid,
      isFormInvalid: !isFormValid,
   }
}