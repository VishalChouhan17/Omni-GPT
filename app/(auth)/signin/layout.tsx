
import type { ReactNode } from "react";


const  AuthLayout=({
  children,
}:{ children:React.ReactNode}) =>{
  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome to OP-GPT
          </h1>
        
        </div>

        {children}
      </div>
    </main>
  );
}


export default AuthLayout