import Button from "../ui/Button.tsx";
import Icon from "../ui/Icon.tsx";
import AuthSignUp from "./contents/AuthSignUp.tsx";

export function AuthContent() {
  return (
    <>
      {/*<AuthEmail/>*/}
      {/*<AuthVerify/>*/}
      <AuthSignUp/>
      <div className="flex justify-center items-center w-1/3 fixed top-0 left-0 h-screen">
        <Button variant="icon-secondary">
          <Icon size={30} icon="chevron.left"/>
        </Button>
      </div>
    </>
  )
}
