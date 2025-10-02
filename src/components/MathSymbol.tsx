import React from "react";
import { cn } from "@/lib/utils";

interface MathSymbolProps {
  symbol: string;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl";
  animate?: boolean;
}

const sizeClasses = {
  sm: "text-xl",
  md: "text-2xl",
  lg: "text-3xl",
  xl: "text-4xl",
  "2xl": "text-5xl",
  "3xl": "text-6xl",
};

const MathSymbol: React.FC<MathSymbolProps> = ({
  symbol,
  className,
  size = "md",
  animate = false,
}) => {
  return (
    <span
      className={cn(
        "math-symbol inline-block",
        sizeClasses[size],
        animate && "animate-float",
        className
      )}
    >
      {symbol}
    </span>
  );
};

export default MathSymbol;
