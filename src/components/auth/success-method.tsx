import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"

export function AuthSuccessMethod() {
  return (
    <>
      <Avatar size="lg">
        <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>

      <p className="text-2xl font-bold text-foreground/40">
        Welcome <span className="text-foreground">Dikiy Dikiens</span>
      </p>
    </>
  )
}
