import {PaginationDots} from "../ui/PaginationDots.tsx";

export function AuthFooter() {
  return (
    <footer className="w-full p-lg flex justify-center">
      <PaginationDots total={3} activeIndex={0}/>
    </footer>
  );
}
