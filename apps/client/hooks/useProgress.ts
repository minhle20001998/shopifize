import { useState } from "react";

export interface ProgressProps<T extends number> {
  defaultStep?: NumberUnion<T>;
  totalSteps: T;
}

type NumberUnion<
  T extends number,
  U extends number[] = []
> = U["length"] extends T ? U[number] : NumberUnion<T, [...U, U["length"]]>;

export interface ProgressReturnType<T extends number> {
  isStepValid: (step: number) => void;
  nextStep: () => void;
  previousStep: () => void;
  moveToStep: (step: NumberUnion<T>) => void;
  step: NumberUnion<T>;
}

export const useProgress = <T extends number>(
  props: ProgressProps<T>
): ProgressReturnType<T> => {
  const { defaultStep = 0, totalSteps } = props;
  const [step, setStep] = useState(defaultStep);

  const isStepValid = (step: number) => {
    if (step < 0 || step > totalSteps) {
      return false;
    }
    return true;
  };

  const nextStep = () => {
    const nextStep = (step as number) + 1;
    if (isStepValid(nextStep)) {
      setStep(nextStep);
    }
  };

  const previousStep = () => {
    const previousStep = (step as number) - 1;
    if (isStepValid(previousStep)) {
      setStep(previousStep);
    }
  };

  const moveToStep = (step: number) => {
    if (isStepValid(step)) {
      setStep(step);
    }
  };

  return {
    step: step as NumberUnion<T, []>,
    isStepValid,
    nextStep,
    previousStep,
    moveToStep,
  };
};
