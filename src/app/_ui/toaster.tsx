
import { cn } from "microtailwind-utils"
import type { ComponentProps, FC } from "react"
import { Toaster as Sonner } from "sonner"

export const Toaster: FC<ComponentProps<typeof Sonner>> = (props) => {
   return (
      <Sonner
         className="toaster group"
         toastOptions={{
            classNames: {
               toast: cn(
                  "group toast",
                  "group-[.toaster]:bg-[#FFF] d:group-[.toaster]:bg-[#202025]",
                  "group-[.toaster]:tc-black group-[.toaster]:bc-slate-300 group-[.toaster]:bw-1. group-[.toaster]:shadow-lg"),
            },
            duration: 3500,
         }}
         {...props}
      />
   )
}
