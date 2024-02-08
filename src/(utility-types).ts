import type { z } from "zod";

export type Prettify<T> = { [Key in keyof T]: T[Key] } & {}

export type UnionToIntersection<U> = (U extends any ? (x: U) => void : never) extends ((x: infer I) => void) ? I : never

export type OmitKeys<T, K extends keyof T> = Omit<T, K> & {}

export type ExcludeLiteral<T, U extends T> = Exclude<T, U>

export type PartialWithId<T> = Partial<T> & { id: string } & {}

export type OptionalRecord<T, V> = { [K in keyof T]?: V }

// export type EntriesOf<T> = Record<keyof T, unknown>

export type ZodEntriesOf<T> = { [Key in keyof T]: z.ZodType<T[Key]> }
