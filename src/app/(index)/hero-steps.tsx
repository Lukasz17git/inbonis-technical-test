import { FC } from "react";
import { PiHexagonThin } from "react-icons/pi";

export const HeroSteps = () => {
   return (
      <div className="grid grid-rows-3 lg:grid-cols-3 lg:grid-rows-none g-8. lg:g-32.">
         <HeroStep number={1} text="Introduce el NIF y la actividad de tu negocio" />
         <HeroStep number={2} text="Contesta un breve cuestionario" />
         <HeroStep number={3} text="Consigue una evaluación y consejos de mejora" />
      </div>
   )
}


const HeroStep: FC<{ number: number, text: string }> = ({ number, text }) => {
   return (
      <div className="frc g-16.">
         <PiHexagonThin className="size-64. fs0 -r-8. pos-r" />
         <b className="tc-[#958c81] ts-24.">{number}</b>
         <p className="ts-13. tw-light">{text}</p>
      </div>
   )

}