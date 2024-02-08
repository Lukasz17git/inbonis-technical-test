import { AppLink } from "../../_ui/nextjs-app-link-relative"


export const NavbarLogo = () => {
   return (
      <h1>
         <AppLink href={'/coach-es-informa'}>
            <strong className="uppercase ts-28. tc-primary">Coach</strong>
            <span className="uppercase ts-28. tc-[#958c81] tw-light">Pyme</span>
         </AppLink>
      </h1>
   )
}