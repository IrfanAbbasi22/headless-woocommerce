'use client';
import { createContext, useContext, useState } from "react";

const StepContext = createContext();

export const StepProvider = ({ children }) => {
  const [currentStep, setCurrentStep] = useState(""); // Default step

  return (
    <StepContext.Provider value={{ currentStep, setCurrentStep }}>
      {children}
    </StepContext.Provider>
  );
};

// Custom hook to use the step context
export const useStep = () => {
  return useContext(StepContext);
};
