'use client'

import { FieldProvider } from "@/lib/maraj-form/provider"
import { useForm } from "@/lib/maraj-form/useForm"
import { zodParser } from "@/lib/maraj-form/zodParser"
import { z } from "zod"
import { Input } from "../_ui/input"
import { FormFieldMessage } from "../_ui/form-field-message"
import { Button } from "../_ui/button"
import { FaArrowRight } from "react-icons/fa6";
import { useActivityListContext } from "../_server-providers/create-contexts"
import { toast } from "sonner"
import { HeroFormCombobox } from "./hero-form-combobox"
import { validateSpanishCif } from "../_utils/validators/spanish-cif-validator"

const URL_POST_ENDPOINT = 'https://demos.inbonis.com/api-coach-es-informa/diagnosis/anon'

export const HeroForm = () => {

   const activityList = useActivityListContext()

   const heroFormSchema = z.object({
      cif: z
         .string()
         .min(1, 'Por favor, rellena este campo')
         .length(9, 'El NIF debe tener 9 caracteres')
         .refine(
            (cif) => validateSpanishCif(cif),
            'Lo sentimos, el NIF introducido no coincide con el formato de un NIF de empresa en España'
         ),

      activity: z
         .string()
         .min(1, 'Por favor, rellena este campo')
         .refine(
            (activity) => activityList.includes(activity),
            'Lo sentimos, la actividad introducida no coincide con ninguna de las actividades disponibles'
         ),
   })

   const { formContent, isFormInvalid, resetForm, submitHandler } = useForm({
      defaultValues: {
         cif: 'B48527139',
         activity: '',
      },
      subscribe: zodParser(heroFormSchema),
   })

   const onSubmit = submitHandler(async (values, changedValues) => {
      const response = await fetch(URL_POST_ENDPOINT, {
         method: 'POST',
         headers: {
            'Content-Type': 'application/json',
         },
         body: JSON.stringify(values),
      })
      if (response.ok) {
         resetForm()
         toast.success('Formulario enviado correctamente')
      } else {
         toast.error('Ha habido un error al enviar el formulario, por favor, inténtalo de nuevo más tarde.')
      }
   })

   return (
      <form onSubmit={onSubmit} className="fc g-16.">
         <FieldProvider formContent={formContent} field="cif">
            <div>
               <Input placeholder="NIF" className="w-100% max-w-none tc-primary" />
               <FormFieldMessage />
            </div>
         </FieldProvider>
         <FieldProvider formContent={formContent} field="activity">
            <div>
               <HeroFormCombobox />
               <FormFieldMessage />
            </div>
         </FieldProvider>
         <div className="frcc py-lg">
            <Button
               type="submit"
               size="xl"
               disabled={isFormInvalid}
               className="g-12."
               hoverEffectVariant="primary"
               aspect="hexagon"
            >
               <span>CONTINUAR</span>
               <FaArrowRight />
            </Button>
         </div>
      </form>
   )
}