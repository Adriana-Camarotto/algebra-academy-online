
import React from 'react';
import { cn } from '@/lib/utils';

interface Step {
  number: number;
  title: string;
}

interface ProgressStepsProps {
  steps: Step[];
  currentStep: number;
}

const ProgressSteps: React.FC<ProgressStepsProps> = ({ steps, currentStep }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-4">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div
              className={cn(
                "w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium",
                currentStep >= step.number
                  ? "bg-primary text-white"
                  : "bg-gray-200 text-gray-600"
              )}
            >
              {step.number}
            </div>
            <span className={cn(
              "ml-2 text-sm font-medium",
              currentStep >= step.number ? "text-primary" : "text-gray-500"
            )}>
              {step.title}
            </span>
            {index < steps.length - 1 && (
              <div className={cn(
                "w-16 h-0.5 mx-4",
                currentStep > step.number ? "bg-primary" : "bg-gray-200"
              )} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgressSteps;
