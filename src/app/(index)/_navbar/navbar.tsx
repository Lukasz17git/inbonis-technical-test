import { cn } from "microtailwind-utils"
import { NavbarLogo } from "./navbar-logo"
import { AppLink } from "../../_ui/nextjs-app-link-relative"
import { Button } from "../../_ui/button"


export const Navbar = () => {
   return (
      <div className={cn(
         "pos-s t-0 z-100 frcb w-100% h-fit",
         "pt-5. pb-6. px-md sm:px-lg",
         "bg-white shadow",
         "byw-1. bbc-[#dcdcdc] btc-[#000]"
      )}
      >
         <NavbarLogo />
         <div className="frcc g-lg">
            <AppLink href={'/coach-es-informa'} className="tw-medium tc-primary-pastel">
               INICIO
            </AppLink>
            <AppLink href={'/coach-es-informa'} className="tw-medium" hoverEffectVariant="primary">
               QUÉ OBTENGO
            </AppLink>
            <Button asChild variant="primary" size="xsm" hoverEffectVariant="primary">
               <AppLink href={'/coach-es-informa'}>
                  ACCEDER
               </AppLink>
            </Button>
         </div>
      </div>
   )
}