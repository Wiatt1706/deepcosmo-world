// pages/NewMapPage.tsx
"use client";
interface StepProps {
  stepNumber: number;
  title?: string;
  children: React.ReactNode;
  currentStep: number;
}

export const Step: React.FC<StepProps> = ({
  stepNumber,
  title,
  children,
  currentStep,
}) => {
  if (currentStep !== stepNumber) {
    return null;
  }

  return (
    <>
      {title && <div className="text-lg font-bold">{title}</div>}
      <div>{children}</div>
    </>
  );
};
