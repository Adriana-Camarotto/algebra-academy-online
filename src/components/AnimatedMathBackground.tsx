import React from "react";
import MathSymbol from "./MathSymbol";

const symbols = [
  "π",
  "∑",
  "∫",
  "≈",
  "≠",
  "±",
  "∞",
  "∆",
  "√",
  "∇",
  "∀",
  "∃",
  "∈",
  "⊂",
  "∩",
  "∪",
  "λ",
  "θ",
  "∂",
  "Ω",
];

interface AnimatedMathBackgroundProps {
  count?: number;
  opacity?: string;
}

const AnimatedMathBackground: React.FC<AnimatedMathBackgroundProps> = ({
  count = 15,
  opacity = "opacity-10",
}) => {
  // Generate random positions for math symbols
  const generateSymbols = () => {
    const elements = [];
    for (let i = 0; i < count; i++) {
      const symbol = symbols[Math.floor(Math.random() * symbols.length)];
      const size =
        Math.random() > 0.5 ? "xl" : Math.random() > 0.3 ? "lg" : "md";
      const left = `${Math.random() * 100}%`;
      const top = `${Math.random() * 100}%`;
      const delay = `${Math.random() * 5}s`;

      elements.push(
        <div
          key={`math-symbol-${i}`}
          className={`floating-element ${opacity} text-white/70`}
          style={{
            left,
            top,
            animationDelay: delay,
          }}
        >
          <MathSymbol symbol={symbol} size={size as any} animate />
        </div>
      );
    }
    return elements;
  };

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {generateSymbols()}
    </div>
  );
};

export default AnimatedMathBackground;
