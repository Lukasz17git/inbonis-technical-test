'use client'

import { FieldProvider } from "@/lib/maraj-form/provider"
import { useForm } from "@/lib/maraj-form/useForm"
import { useState } from "react"
import { Input } from "../_ui/input"
import { FormFieldMessage } from "../_ui/form-field-message"
import { Button } from "../_ui/button"

const BASE_URL = typeof window === 'undefined' ? 'http://localhost:3000' : window.location.origin
const ENDPOINT = (email: string) => `${BASE_URL}/api/user/${email}`

export const BackendEnpointRequest = () => {

   const [currentResponse, setCurrentResponse] = useState(null)

   const { submitHandler, formContent, resetForm } = useForm({
      defaultValues: {
         email: 'JohnDoe@example.com',
         action: 'remove',
         ammount: 100,
      }
   })

   const onSubmit = submitHandler(async (values, changedValues) => {
      const { email, ...data } = values
      const response = await fetch(ENDPOINT(email), {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(data),
      })
      setCurrentResponse(await response.json())
   })

   return (
      <div className="my-72.">
         <h2 className="ts-24.">Backend Enpoint Request:</h2>
         <form onSubmit={onSubmit} className="fc g-16. my-16.">
            <div className="frcc g-16.">
               <FieldProvider formContent={formContent} field='email'>
                  <Input placeholder="email" />
                  <FormFieldMessage />
               </FieldProvider>
               <FieldProvider formContent={formContent} field='action'>
                  <Input placeholder="action" />
                  <FormFieldMessage />
               </FieldProvider>
               <FieldProvider formContent={formContent} field='ammount'>
                  <Input placeholder="ammount" />
                  <FormFieldMessage />
               </FieldProvider>
            </div>
            <div className="frcb">
               <Button onClick={resetForm}>Reset</Button>
               <Button type="submit">Submit</Button>
            </div>
         </form>
         <pre>{JSON.stringify(currentResponse, null, 2)}</pre>
      </div>
   )
}