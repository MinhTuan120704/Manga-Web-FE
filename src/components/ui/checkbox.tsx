import * as React from "react";
import * as CheckboxPrimitive from "@radix-ui/react-checkbox";
import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils";

function Checkbox({
  className,
  ...props
}: React.ComponentProps<typeof CheckboxPrimitive.Root>) {
  return (
    <CheckboxPrimitive.Root
      data-slot="checkbox"
      className={cn(
        "peer border-2 border-[color:var(--color-primary)] bg-transparent dark:bg-transparent hover:bg-[color:var(--color-primary)]/10 data-[state=checked]:bg-[color:var(--color-primary)] data-[state=checked]:text-[color:var(--color-primary-foreground)] data-[state=checked]:border-[color:var(--color-primary)] dark:data-[state=checked]:bg-[color:var(--color-primary)] dark:data-[state=checked]:text-[color:var(--color-primary-foreground)] dark:data-[state=checked]:border-[color:var(--color-primary)] focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:dark:ring-ring/60 aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive size-4 shrink-0 rounded-[4px] shadow-sm transition-shadow outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50",
        className
      )}
      {...props}
    >
      <CheckboxPrimitive.Indicator
        data-slot="checkbox-indicator"
        className="flex items-center justify-center text-current transition-none"
      >
        <CheckIcon className="size-3.5" />
      </CheckboxPrimitive.Indicator>
    </CheckboxPrimitive.Root>
  );
}

export { Checkbox };
