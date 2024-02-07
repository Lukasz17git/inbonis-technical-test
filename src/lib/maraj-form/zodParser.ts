import { type DotPaths } from "maraj";
import { type FormErrorStore, type FormSubscription } from "./useForm";
import { type ZodType, ZodError } from "zod";

type ZodParser = <T extends Record<PropertyKey, any>>(schema: ZodType<T>, refineKey?: keyof T) => FormSubscription<T>

export const zodParser: ZodParser = (schema, refineKey) => (state, { errorsStore }) => {
   const errors = zodErrorsParser(schema, state, refineKey)
   errorsStore.handlers.setState(() => errors, true)
}

const zodErrorsParser = <TState extends Record<PropertyKey, any>>(schema: ZodType<TState>, state: TState, refineKey?: keyof TState) => {
   const errorsObject: FormErrorStore<TState> = {}
   try {
      schema.parse(state)
      // parse(schema, state)
   } catch (error) {
      if (error instanceof ZodError) {
         for (const issue of error.issues) {
            if (!issue.path) continue
            // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
            const dotPath = (issue.path.map((v) => v).join('.') || refineKey || Object.keys(state)[0]) as DotPaths<TState>
            /* Continue if there is already an error set in the same field. */
            if (typeof errorsObject[dotPath] === 'string') continue
            errorsObject[dotPath] = issue.message
         }
      } else {
         throw new Error(`an error occured parsing the Valibot Schema which is not related to a Valibot Error: ${JSON.stringify(error)}`)
      }
   }
   return errorsObject
}