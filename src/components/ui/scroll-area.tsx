import * as React from "react";
import { cn } from "@/lib/utils";

interface ScrollAreaProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode;
}

const ScrollArea = React.forwardRef<HTMLDivElement, ScrollAreaProps>(
  ({ className, children, style, ...props }, ref) => {
    return (
      <div
        ref={ref}
        data-slot="scroll-area"
        className={cn("relative overflow-auto scroll-smooth overscroll-contain", className)}
        style={{
          willChange: "scroll-position",
          WebkitOverflowScrolling: "touch",
          ...style,
        }}
        {...props}
      >
        {children}
      </div>
    );
  }
);
ScrollArea.displayName = "ScrollArea";

export { ScrollArea };
