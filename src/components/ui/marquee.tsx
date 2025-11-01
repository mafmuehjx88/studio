import { cn } from "@/lib/utils";

export function Marquee({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("relative flex w-full overflow-x-hidden", className)}>
      <div className="animate-marquee whitespace-nowrap py-2">{children}</div>
      <div className="absolute top-0 animate-marquee2 whitespace-nowrap py-2">
        {children}
      </div>
    </div>
  );
}
