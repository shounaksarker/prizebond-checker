import { cn } from "@lib/utils"

function Skeleton({
  className,
  ...props
}) {
  return (
    <div
      data-slot="skeleton"
      className={cn("animate-pulse rounded-md bg-gray-200", className)}
      {...props} />
  );
}

export { Skeleton }
