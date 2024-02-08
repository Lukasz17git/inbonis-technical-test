

import { type UpdateObject, type UpdateValue, type DotPaths, type ReturnedValueInPath, select, update, type KeyOf, type Strict, type ValueInPath } from "maraj"
import { type FunctionComponentElement, type ProviderProps, type ReactNode, createContext, createElement, useContext, useRef, useEffect } from "react"
import { type StoreApi, createStore, useStore } from "zustand"
import { useStoreWithEqualityFn } from 'zustand/traditional'
import { shallow } from "zustand/shallow"

// Normal Store
type UseStore<TState> = <U>(selector: (state: TState) => U, equalityFn?: (a: U, b: U) => boolean) => U

type UseStoreViaPath<TState> = <TPath extends DotPaths<TState>>(path: TPath) => ReturnedValueInPath<TState, TPath>
type UseRecordStoreViaPath<TState> = <TPath extends KeyOf<TState>>(path: TPath) => ReturnedValueInPath<TState, TPath> //TState[TPath]

type UpdateState<TState> = (updates: (state: TState) => Strict<UpdateObject<TState>>) => void
type UpdateRecordStoreState<TState> = (updates: (state: TState) => Strict<UpdateObject<TState, KeyOf<TState>>>) => void

type UpdateStateViaPath<TState> = <TPath extends DotPaths<TState>>(path: TPath, newValueInPath: UpdateValue<TState, TPath>) => void
type UpdateRecordStoreStateViaPath<TState> = <TPath extends KeyOf<TState>>(path: TPath, newValueInPath: UpdateValue<TState, TPath>) => void

type StoreProvider<TState> = (props: { children: ReactNode, initialState?: TState }) => FunctionComponentElement<ProviderProps<StoreApi<TState> | undefined>>

// Common Handlers
type Handlers<TState> = {
   getState: StoreApi<TState>['getState'],
   setState: StoreApi<TState>['setState'],
   subscribe: StoreApi<TState>['subscribe'],
}

// Update Handlers
type UpdateHandlers<TState> = {
   updateState: UpdateState<TState>,
   updateStateViaPath: UpdateStateViaPath<TState>,
}

export type UpdateStateAction<T extends () => (Handlers<any> & UpdateHandlers<any>)> = Parameters<ReturnType<T>['updateState']>['0']

type RecordStoreUpdateHandlers<TState> = {
   updateState: UpdateRecordStoreState<TState>,
   updateStateViaPath: UpdateRecordStoreStateViaPath<TState>,
}

/**
 * --------------------------------------------------------------------
 *  COMPONENT STORE
 * --------------------------------------------------------------------
 */

// Normal Store
type DefaultComponentStore<TState> = {
   useStore: UseStore<TState>,
   useStoreViaPath: UseStoreViaPath<TState>,
   storeHandlers: Handlers<TState> & UpdateHandlers<TState>
}

// Normal Store Named
type ComponentStore<TState, TStoreName extends string> = {
   [K in `use${TStoreName}Store`]: DefaultComponentStore<TState>['useStore'];
} & { [K in `use${TStoreName}StoreViaPath`]: DefaultComponentStore<TState>['useStoreViaPath'] }
   & { handlers: DefaultComponentStore<TState>['storeHandlers'] }


export const createComponentStore = <TStoreName extends string, TState>(storeName: TStoreName, defaultState: TState) => {
   const store = createStore(() => (defaultState))
   const componentStore: DefaultComponentStore<TState> = {
      useStore: (selector, equalityFn = shallow) => useStoreWithEqualityFn(store, selector, equalityFn),
      useStoreViaPath: (path) => useStore(store, state => select(state, path)),
      storeHandlers: {
         getState: store.getState,
         setState: store.setState,
         subscribe: store.subscribe,
         updateState: (updates) => store.setState(state => update(state, updates(state)), true),
         updateStateViaPath: (path, newValue) => store.setState(state => {
            const updateObject: UpdateObject<TState> = {}
            updateObject[path] = newValue
            return update(state, updateObject)
         }, true)
      },
   }
   return {
      [`use${storeName}Store`]: componentStore.useStore,
      [`use${storeName}StoreViaPath`]: componentStore.useStoreViaPath,
      handlers: componentStore.storeHandlers
   } as ComponentStore<TState, TStoreName>
}

/**
 * --------------------------------------------------------------------
 *  COMPONENT DOT-PATH STORE
 * --------------------------------------------------------------------
 * 
 *  DISCLAIMER: EACH FIELD IS GOING TO HAVE ITS OWN INDEPENDENT VALUE,
 *  EVEN IF ITS "NESTED" INSIDE AN ARRAY OR OBJECT AND THIS "PARENT"
 *  CHANGES ITS VALUE, THIS MEANS IF YOU REMOVE A "PARENT" PATH VALUE,
 *  ITS CHILDREN WILL STILL STAY THERE.
 * 
 *  Example: { "a.1.name": "value" } will still stay even if i set { "a": "value" },
 *  the store will be { "a.1.name": "error", "a": "value" }
 * 
 */

type DefaultDotPathRecordComponentStore<TState> = {
   useStore: UseStore<TState>,
   useStoreViaPath: UseRecordStoreViaPath<TState>,
   storeHandlers: Handlers<TState> & RecordStoreUpdateHandlers<TState>
}

type DotPathRecordComponentStore<TState, TStoreName extends string> = {
   [K in `use${TStoreName}Store`]: DefaultDotPathRecordComponentStore<TState>['useStore'];
} & { [K in `use${TStoreName}StoreViaPath`]: DefaultDotPathRecordComponentStore<TState>['useStoreViaPath'] }
   & { handlers: DefaultDotPathRecordComponentStore<TState>['storeHandlers'] }

export const createDotPathRecordComponentStore = <TState extends Record<PropertyKey, any>, TStoreName extends string>(storeName: TStoreName, defaultState: TState) => {
   const store = createStore(() => (defaultState))
   const componentStore: DefaultDotPathRecordComponentStore<TState> = {
      useStore: (selector, equalityFn = shallow) => useStoreWithEqualityFn(store, selector, equalityFn),
      useStoreViaPath: (path) => useStore(store, state => select(state, path)),
      // useStoreViaPath: (path) => useStore(store, state => state[path]),
      storeHandlers: {
         getState: store.getState,
         setState: store.setState,
         subscribe: store.subscribe,
         // need to add this so all keys exist beforehand
         updateState: (updates) => store.setState(state => {
            const updateObject = updates(state)
            const addUpdateObjectKeys: Partial<Record<KeyOf<TState>, undefined>> = {}
            Object.keys(updateObject).forEach(key => addUpdateObjectKeys[key as KeyOf<TState>] = undefined)
            const stateWithExistentKeys = { ...addUpdateObjectKeys, ...state }
            return update(stateWithExistentKeys, updateObject)
         }, true),
         updateStateViaPath: (path, newValue) => store.setState(state => {
            const newValueInPath: ValueInPath<typeof state, typeof path> = typeof newValue === 'function' ? newValue(state[path]) : newValue
            const updates = { [path]: newValueInPath } as Partial<typeof state>
            return updates
         })
      },
   }
   return {
      [`use${storeName}Store`]: componentStore.useStore,
      [`use${storeName}StoreViaPath`]: componentStore.useStoreViaPath,
      handlers: componentStore.storeHandlers
   } as DotPathRecordComponentStore<TState, TStoreName>
}


/**
 * --------------------------------------------------------------------
 *  EXTERNAL STORE
 * --------------------------------------------------------------------
 */
type UsePopulateStore<TState> = <TPath extends DotPaths<TState>>(path: TPath, value: UpdateValue<TState, TPath>) => ReturnedValueInPath<TState, TPath>

type DefaultExternalStore<TState> = {
   StoreProvider: StoreProvider<TState>,
   useStore: UseStore<TState>,
   useStoreViaPath: UseStoreViaPath<TState>,
   useStoreHandlers: () => Handlers<TState> & UpdateHandlers<TState>,
   usePopulateStoreFromServer: UsePopulateStore<TState>,
}

type ExternalStore<TState, TStoreName extends string> = {
   [K in `use${TStoreName}Store`]: DefaultExternalStore<TState>['useStore']
} & { [K in `use${TStoreName}StoreViaPath`]: DefaultExternalStore<TState>['useStoreViaPath'] }
   & { [K in `use${TStoreName}StoreHandlers`]: DefaultExternalStore<TState>['useStoreHandlers'] }
   & { [K in `${TStoreName}StoreProvider`]: DefaultExternalStore<TState>['StoreProvider'] }
   & { [K in `usePopulate${TStoreName}StoreFromServer`]: DefaultExternalStore<TState>['usePopulateStoreFromServer'] }

export const createExternalStore = <TStoreName extends string, TState extends Record<PropertyKey, any>>(storeName: TStoreName, defaultState: TState) => {

   // const store = createStore(() => (defaultState))
   const StoreContext = createContext<StoreApi<TState> | undefined>(undefined)

   const useStoreFromContext = () => {
      const storeInContext = useContext(StoreContext)
      if (storeInContext === undefined) throw new Error(`You forgot to add the Provider for ${storeName}Store`)
      return storeInContext
   }

   const externalStore: DefaultExternalStore<TState> = {
      StoreProvider: ({ children, initialState }) => createElement(StoreContext.Provider, { value: createStore(() => initialState ?? defaultState) }, children),
      useStore: (selector, equalityFn = shallow) => {
         const storeInContext = useStoreFromContext()
         return useStoreWithEqualityFn(storeInContext, selector, equalityFn)
      },
      useStoreViaPath: (path) => {
         const storeInContext = useStoreFromContext()
         return useStore(storeInContext, state => select(state, path))
      },
      useStoreHandlers: () => {
         const storeInContext = useStoreFromContext()
         return {
            getState: storeInContext.getState,
            setState: storeInContext.setState,
            subscribe: storeInContext.subscribe,
            updateState: (updates) => storeInContext.setState(state => update(state, updates(state)), true),
            updateStateViaPath: (path, newValue) => storeInContext.setState(state => {
               const updateObject: UpdateObject<TState> = {}
               updateObject[path] = newValue
               return update(state, updateObject)
            }, true)
         }
      },
      usePopulateStoreFromServer: (path, valueOrUpdateFn) => {
         const initialRender = useRef(true)
         const storeInContext = useStoreFromContext()
         const value = typeof valueOrUpdateFn === 'function' ? valueOrUpdateFn(select(storeInContext.getState(), path)) : valueOrUpdateFn
         const reactiveValue = useStore(storeInContext, state => initialRender.current ? value : select(state, path))
         useEffect(() => {
            initialRender.current = false
            storeInContext.setState(state => {
               const updateObject: UpdateObject<TState> = {}
               updateObject[path] = value
               return update(state, updateObject)
            }, true)
         }, [path, value, storeInContext])
         return reactiveValue
      }
   }

   return {
      [`${storeName}StoreProvider`]: externalStore.StoreProvider,
      [`use${storeName}Store`]: externalStore.useStore,
      [`use${storeName}StoreViaPath`]: externalStore.useStoreViaPath,
      [`use${storeName}StoreHandlers`]: externalStore.useStoreHandlers,
      [`usePopulate${storeName}StoreFromServer`]: externalStore.usePopulateStoreFromServer,
   } as ExternalStore<TState, TStoreName>
}