import AuthHeader from "../components/auth/AuthHeader.tsx";
import {AuthFooter} from "../components/auth/AuthFooter.tsx";

export function Auth() {
  return (
    <main className="size-full flex flex-col justify-center items-center">
      <AuthHeader/>

      <div className="flex-1">

      </div>

      <AuthFooter/>
    </main>
  )
}
