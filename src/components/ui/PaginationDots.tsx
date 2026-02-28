interface PaginationDotsProps {
  total: number;
  activeIndex: number;
}

export function PaginationDots({total, activeIndex}: PaginationDotsProps) {
  return (
    <div className="flex gap-sm justify-center">
      {Array.from({length: total}).map((_, index) => (
        <span
          key={index}
          className={`w-sm h-sm rounded-full ${
            index === activeIndex ? "bg-text-main" : "bg-text-secondary"
          }`}
        ></span>
      ))}
    </div>
  );
}
