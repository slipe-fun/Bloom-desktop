import DashedBox from "@/components/ui/dashed-box"
import Key from "@/assets/icons/key.svg?react"

export function AuthSignUpMethod() {
  return (
    <>
      <DashedBox width={100} height={100} className="text-foreground/20">
        <Key className="w-17.5 h-17.5 text-foreground/20" />
      </DashedBox>
      <div className="flex max-w-100 flex-col items-center justify-center gap-2">
        <h2 className="text-center text-2xl font-bold text-foreground">
          Sign up via pressing button
        </h2>

        <p className="text-center text-base font-medium text-foreground/40">
          Just click the button, and all the cryptographic magic will happen for
          you
        </p>
      </div>
    </>
  )
}
