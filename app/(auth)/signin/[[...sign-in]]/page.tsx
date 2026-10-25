import { SignIn } from "@clerk/nextjs";
import { Suspense } from "react";

export default function page() {
  return (
    <Suspense>
      <SignIn forceRedirectUrl="/" />
    </Suspense>
  );
}
