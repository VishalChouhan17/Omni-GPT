import { ModeToggle } from "@/components/ui/mode-toggle";
import { UserButton } from "@clerk/nextjs";
import { auth } from "@clerk/nextjs/server";
import Image from "next/image";

export default  async function Home() {
      await auth.protect();
  return (
   <div>
    <h1>Hello World</h1>
    <ModeToggle />
    <UserButton/>
    {/* from clerk */}
   </div>
  );
}