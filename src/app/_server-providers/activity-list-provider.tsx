import { FCC } from "@/app/(react-utility-types)"
import { ActivityListContextProvider } from "./create-contexts"

type FullActivityList = ({ code: string, description: string, associated_cnaes: string[] })[]
export type ActivityList = string[]

const ACTIVITY_LIST_URL = 'https://demos.inbonis.com/api-coach-es-informa/activities'

/*
Esto estaría mejor stremearlo ya que el contenido de la página no depende de los datos obtenidos con 
este fetch, por lo tanto no es necesario esperar a que se obtengan los datos para enviar el primer contenido
de la página, también se podría hacer con reactQuery/swr, pero tienes menos waterfalls usando RSC.
*/
export const ActivityListServerProvider: FCC = async ({ children }) => {
   const response = await fetch(ACTIVITY_LIST_URL)
   const activityList: FullActivityList = await response.json()
   const simplifiedActivityList = [...new Set(activityList.map((activity) => activity.description).sort())]
   return (
      <ActivityListContextProvider value={simplifiedActivityList}>
         {children}
      </ActivityListContextProvider>
   )
}
