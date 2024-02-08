import { cache } from "react"

const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

export const fetchActivityList = cache(async () => {
   const ACTIVITY_LIST_URL = 'https://demos.inbonis.com/api-coach-es-informa/activities'
   const response = await fetch(ACTIVITY_LIST_URL)
   const activityList = await response.json()
   await wait(2000)
   return activityList
})