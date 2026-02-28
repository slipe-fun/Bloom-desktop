import {PaginationDots} from "../ui/PaginationDots.tsx";

interface AuthFooterProps {
  step: number;
}

export function AuthFooter({step}: AuthFooterProps) {
  return (
    <footer className="w-full p-lg flex justify-center select-none">
      <PaginationDots total={3} activeIndex={step}/>
    </footer>
  );
}
