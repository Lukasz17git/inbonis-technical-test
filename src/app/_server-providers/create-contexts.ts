'use client'

import { FC, createContext as _createContext, useContext as _useContext, createElement } from "react"
import { ActivityList } from "./activity-list-provider"
import { FCCV } from "../(react-utility-types)"

const FORGOT_TO_ADD_CONTEXT = Symbol('forgot to add context')

const createContext = <T extends unknown>(defaultValue: T) => {
   const Context = _createContext<T>(FORGOT_TO_ADD_CONTEXT as unknown as T)
   const useContext = () => {
      const contextValue = _useContext(Context)
      if (contextValue === FORGOT_TO_ADD_CONTEXT) throw new Error('useContext must be used within a ContextProvider')
      return contextValue
   }
   const Provider: FCCV<T> = ({ children, value }) => createElement(Context.Provider, { value }, children)
   return [Provider, useContext] as const
}

/* CONTEXTS */

export const [ActivityListContextProvider, useActivityListContext] = createContext<ActivityList>([])