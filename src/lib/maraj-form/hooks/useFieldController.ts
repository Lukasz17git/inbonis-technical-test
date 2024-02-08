import { type ChangeEventHandler, type FocusEventHandler, type MouseEventHandler, useContext, useEffect } from "react"
import { FieldContext } from "../context"
import { getDefaultModifiers, getUnknownSetterModifier } from "./modifiers"
import { type FieldStatus } from "../useForm"
import { strict } from "maraj"
import type { OmitKeys } from "@/(utility-types)"

export type ValidTypesAsInputValue = string | number | undefined | readonly string[] | boolean

type OnChangeHandler = ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | undefined
type OnBlurHandler = FocusEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> | undefined
type OnClickHandler = MouseEventHandler<HTMLButtonElement> | undefined

type ReturnControllerTypeWithoutContext = {
   controllerProps: {
      value?: undefined,
      onChange: OnChangeHandler,
      onBlur: OnBlurHandler
   },
   descriptionId?: undefined,
   messageId?: undefined,
   error?: undefined,
   status?: undefined,
   fieldId?: undefined,
   fieldName?: undefined,
}

type ReturnControllerTypeWithContext = {
   controllerProps: {
      value: Exclude<ValidTypesAsInputValue, boolean>,
      onChange: OnChangeHandler,
      onBlur: OnBlurHandler
   },
   descriptionId: string,
   messageId: string,
   error: string | undefined,
   status: FieldStatus | undefined,
   fieldId: string,
   fieldName: string,
}

type UseFieldController = (onChange: OnChangeHandler, onBlur: OnBlurHandler) => ReturnControllerTypeWithoutContext | ReturnControllerTypeWithContext

export const useFieldController: UseFieldController = (onChange, onBlur) => {

   const fieldContext = useContext(FieldContext)
   if (!fieldContext) return { controllerProps: { onChange, onBlur } }

   const { fieldPath, valuesStore, errorsStore, statusStore, modifiers, fieldData: { name, fieldId, descriptionId, messageId } } = fieldContext
   const _value = valuesStore.useValuesStoreViaPath(fieldPath)
   const error = errorsStore.useErrorsStoreViaPath(fieldPath)
   const status = statusStore.useStatusStoreViaPath(fieldPath)
   const defaultModifiers = getDefaultModifiers(_value)
   const getModifier: (v: any) => ValidTypesAsInputValue = modifiers?.getFromStore ?? defaultModifiers.gettingFromStore
   const _setModifier = modifiers?.setToStore ?? defaultModifiers.settingToStore

   const _onChange: OnChangeHandler = (e) => {
      if (onChange) onChange(e)
      const setModifier = _setModifier ?? getUnknownSetterModifier(e.target.type)
      valuesStore.handlers.updateStateViaPath(fieldPath, setModifier(e.target.value))
      if (status?.isDirty ?? status?.isDirty === undefined) {
         statusStore.handlers.updateStateViaPath(fieldPath, v => strict({ ...v, isDirty: false }))
      }
   }

   const _onBlur: OnBlurHandler = (e) => {
      if (onBlur) onBlur(e)
      if (status?.isDirty) {
         const setModifier = _setModifier ?? getUnknownSetterModifier(e.target.type)
         valuesStore.handlers.updateStateViaPath(fieldPath, setModifier(e.target.value))
      } else {
         statusStore.handlers.updateStateViaPath(fieldPath, v => strict({ ...v, isDirty: true }))
      }
   }

   const value = getModifier(_value)

   return {
      controllerProps: {
         onChange: _onChange,
         onBlur: _onBlur,
         value: typeof value === 'boolean' ? `${value}` : value,
      },
      status,
      error,
      descriptionId,
      messageId,
      fieldId,
      fieldName: name,
   }
}

type ReturnClickControllerTypeWithoutContext = OmitKeys<ReturnControllerTypeWithoutContext, 'controllerProps'> & { isOn?: undefined, controllerProps: { onClick: OnClickHandler } }
type ReturnClickControllerTypeWithContext = OmitKeys<ReturnControllerTypeWithContext, 'controllerProps'> & { isOn: boolean, controllerProps: { onClick: OnClickHandler } }

type UseFieldClickController = (onClick: OnClickHandler) => ReturnClickControllerTypeWithoutContext | ReturnClickControllerTypeWithContext

export const useFieldClickController: UseFieldClickController = (onClick) => {

   const fieldContext = useContext(FieldContext)
   if (!fieldContext) return { controllerProps: { onClick } }

   const { fieldPath, valuesStore, errorsStore, statusStore, modifiers, fieldData: { name, fieldId, descriptionId, messageId } } = fieldContext
   const _value = valuesStore.useValuesStoreViaPath(fieldPath)
   const error = errorsStore.useErrorsStoreViaPath(fieldPath)
   const status = statusStore.useStatusStoreViaPath(fieldPath)

   const defaultModifiers = getDefaultModifiers(_value)
   const getModifier: (v: any) => ValidTypesAsInputValue = modifiers?.getFromStore ?? defaultModifiers.gettingFromStore
   const setModifier = modifiers?.setToStore ?? defaultModifiers.settingToStore ?? getUnknownSetterModifier('toggle')

   const _onClick: OnClickHandler = (e) => {
      if (onClick) onClick(e)
      valuesStore.handlers.updateStateViaPath(fieldPath, setModifier(_value))
      if (!status?.isDirty) {
         statusStore.handlers.updateStateViaPath(fieldPath, v => strict({ ...v, isDirty: true }))
      }
   }

   return {
      controllerProps: {
         onClick: _onClick,
      },
      status,
      error,
      descriptionId,
      messageId,
      fieldId,
      fieldName: name,
      isOn: !!getModifier(_value),
   }
}