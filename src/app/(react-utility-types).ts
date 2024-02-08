import { type FC, type ReactNode } from "react";

/**
 * React children utility type
 */
export type Children = { children?: ReactNode };

/**
 * FC with children
 */
export type FCC<T = {}> = FC<T & Children>

/**
 * FC with className
 */
export type FCClassName<T = {}> = FC<T & { className?: string }>

/**
 * FC with children and className
 */
export type FCCClassName<T = {}> = FC<T & Children & { className?: string }>

/**
 * FC with params
 */
export type FCP<T extends Record<string, string>> = FC<{ params: T }>

/**
 * FC with children and value, used for contexts
 */
export type FCCV<T> = FC<Children & { value: T }>