export default function AutoGrid({ children, min = 220 }) {
  return (
    <div
      className="grid gap-6 w-full"
      style={{
        gridTemplateColumns: `repeat(auto-fit, minmax(${min}px, 1fr))`,
      }}
    >
      {children}
    </div>
  );
} 