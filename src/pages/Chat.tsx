import Icon from "../components/ui/Icon.tsx";
import Button from "../components/ui/Button.tsx";

export function Chat() {
  // TODO: Refactor to components
  return (
    <div className="size-full flex justify-center items-center relative overflow-hidden">
      <aside className="w-96 h-full flex flex-col select-none">
        <div className="w-full h-full flex-1">
          <div>
            {/*TODO*/}
          </div>
          <section className="flex flex-1 w-ful h-full overflow-y-auto justify-center items-center ">
            {/*  IF EMPTY: */}
            <div className="flex w-full h-full flex-1 justify-center items-center px-xxxxl">
              <div
                className="flex flex-col w-full rounded-xxxl bg-foreground-soft p-xxl gap-lg justify-center items-center"
              >
                <span className="flex size-xxsuper justify-center items-center bg-foreground-transparent rounded-full">
                  <Icon size={44} icon="message"/>
                </span>
                <h1 className="text-md text-text-main text-center w-full">
                  Your chat list is empty, let’s create a new chat!
                </h1>
                <Button className="w-full">Create chat</Button>
              </div>
            </div>
          </section>
        </div>
        <div className="">
          <nav>
            {/*TODO*/}
          </nav>
        </div>
      </aside>
      <main className="w-full h-full flex-1 bg-foreground-soft flex justify-center items-center">
        <div
          className="px-xl py-md text-text-main bg-background rounded-full font-semibold text-md select-none">
          Select a chat to start messaging
        </div>
      </main>
    </div>
  );
}
