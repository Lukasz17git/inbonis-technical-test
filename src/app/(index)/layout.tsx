import { FCC } from "../(react-utility-types)"
import { Navbar } from "./_navbar/navbar"


const layout: FCC = async ({ children }) => {
   return (
      <main className="fc min-h-100vh">
         <Navbar />
         <div className='bg-white fg1'>
            {children}
         </div>
      </main>
   )
}

export default layout