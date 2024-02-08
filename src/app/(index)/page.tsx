import { Img } from "../_ui/img";
import { HeroFooter } from "./hero-footer";
import { HeroForm } from "./hero-form";
import { ActivityListServerProvider } from "../_server-providers/activity-list-provider";
import { HeroSteps } from "./hero-steps";
import { BackendEnpointRequest } from "./backend-enpoint-request";

export default async function Home() {
   return (
      <div className='w-75% max-w-1000. m-a'>
         <Img className="m-a" src='https://demos.inbonis.com/coach-es-informa/assets/home-banner.jpg' />
         <h1 className="tw-semibold ts-28.">Evalúa y mejora tu negocio</h1>
         <ActivityListServerProvider>
            <HeroForm />
         </ActivityListServerProvider>
         <HeroSteps />
         <HeroFooter />
         <hr />
         <h2 className="ts-24. mt-48.">Backend refactor:</h2>
         <Img className="w-100% fs0" src="https://img001.prntscr.com/file/img001/DPtmgmGvSYWl4REnVHXIIA.png" />
         <hr />
         <BackendEnpointRequest />
      </div>
   );
}