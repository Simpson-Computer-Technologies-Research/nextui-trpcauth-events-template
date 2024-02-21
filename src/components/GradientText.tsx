import { cn } from "@/lib/utils/cn";

export default function GradientText({
  children,
  ...props
}: React.PropsWithChildren<React.ComponentProps<"h1">>) {
  return (
    <span
      {...props}
      className={cn(
        "bg-transparent bg-gradient-to-r from-purple-600 to-violet-700 bg-clip-text text-transparent",
        props.className,
      )}
    >
      {children}
    </span>
  );
}
