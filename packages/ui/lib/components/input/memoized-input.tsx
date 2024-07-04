import { memo } from "react";
import { CustomInput } from ".";
import { getIn } from "formik";

export const MemoizedInput = memo(CustomInput, (prev, next) => {

  const {
    formik: formikPrev
  } = prev;

  const {
    formik: formikNext,
    name,
    arrayName
  } = next;

  const inputName = arrayName ? arrayName : name ?? "";


  if (arrayName) {
    const prevValue = getIn(formikPrev?.values, inputName)
    const nextValue = getIn(formikNext?.values, inputName)
    if (prevValue === nextValue) {
      return true;
    }
  } else {
    const prevValue = (formikPrev?.values as Record<string, unknown>)?.[inputName]
    const nextValue = (formikNext?.values as Record<string, unknown>)?.[inputName]

    if (prevValue === nextValue) {
      return true;
    }
  }


  return false;
}) as typeof CustomInput
