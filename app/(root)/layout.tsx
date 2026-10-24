 import React from 'react'
 import { onboard } from '@/features/auth/action/onboard'
 import { auth } from '@clerk/nextjs/server'
 const RootGrouplayout = async({children}:{children:React.ReactNode}) => {
      await auth.protect();
      await onboard();
   return (
     <div>
          {children}
     </div>
   )
 }
 
 export default RootGrouplayout
 