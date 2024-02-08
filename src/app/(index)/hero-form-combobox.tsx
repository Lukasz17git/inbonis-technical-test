import { useEffect, useState } from "react"
import { Input } from "../_ui/input"
import { useActivityListContext } from "../_server-providers/create-contexts"
import { IoIosArrowDown } from "react-icons/io";
import { cn } from "microtailwind-utils";
import { useFieldHandlers } from "@/lib/maraj-form/hooks/useFieldHandlers";
import { useFieldValue } from "@/lib/maraj-form/hooks/useFieldValue";
import { Button } from "../_ui/button";

/**
 * Normalmente este componente lo haría 100% reutilizable, o cogería algún combobox ya hecho, 
 * para poder tener buena accesibilidad y demás; pero como no tenía hecho un combobox antes
 * lo he hecho asi para hacer el apaño, faltaría revisar accesibilidad y demás.
 */

export const HeroFormCombobox = () => {

   const value = useFieldValue()
   const { setValue } = useFieldHandlers()

   const [shouldShowComboboxList, setShouldShowComboboxList] = useState(false)
   const [shouldCloseComboboxListOnNextRender, setShouldCloseComboboxListOnNextRender] = useState(false)

   const activityList = useActivityListContext()
   const activityListToShow = activityList.filter(activity => activity.toLowerCase().includes(value.toLowerCase())).slice(0, 100)

   const closeComboboxList = () => setShouldCloseComboboxListOnNextRender(true)
   const openComboboxList = () => {
      setShouldShowComboboxList(true)
      setShouldCloseComboboxListOnNextRender(false)
   }

   const selectItem = (activity: string) => {
      closeComboboxList()
      if (activity === value) return
      setValue(activity)
   }

   useEffect(() => {
      const timeoutId = requestAnimationFrame(() => {
         if (shouldCloseComboboxListOnNextRender) {
            setShouldShowComboboxList(false)
            setShouldCloseComboboxListOnNextRender(false)
         }
      })
      return () => cancelAnimationFrame(timeoutId)
   }, [shouldCloseComboboxListOnNextRender])

   return (
      <div className="pos-r z-1" onBlur={closeComboboxList} onFocus={openComboboxList}>
         <Input
            role='combobox'
            onChange={(e) => setValue(e.target.value)}
            placeholder="Sector de actividad"
            className="tc-primary max-w-none w-100% peer"
         />
         <div className="pos-a -z-1 h-100% r-0 t-0 frcc px-16. ts-16. blw-1. blc-slate-300 peer-hover:tc-primary">
            ELEGIR
            <IoIosArrowDown className="ml-8." />
         </div>
         {shouldShowComboboxList && (
            <div
               className="pos-a z-1 w-100% max-h-260. oya bc-slate-300 bw-1. shadow"
            >
               {activityListToShow.map((activity) => (
                  <option
                     key={activity}
                     tabIndex={0}
                     role='option'
                     onClick={() => selectItem(activity)}
                     className={cn(
                        "w-100% px-16. py-4. max-w-100% oh text-ellipsis bg-white bbc-gray-300 bbw-1. br-0 tc-neutral-500 ",
                        "hover:tc-primary hover:cursor-pointer hover:bg-slate-50"
                     )}
                  >
                     {activity}
                  </option>
               ))}
            </div>
         )}
      </div>
   )
}