/* eslint-disable react-hooks/exhaustive-deps */
import { isNil } from "@shopifize/helpers";
import { FormikProps, getIn } from "formik";
import { useMemo } from "react";

export interface Props<T> {
  arrayName?: string
  name?: string
  formik?: FormikProps<T>
  isError?: boolean
}

export const useInputFormik = <T, Value>(props: Props<T>) => {
  const { name, arrayName, formik } = props;
  const inputName = arrayName ? arrayName : (name as keyof T) ?? "";

  const isError = useMemo(() => {
    if(!isNil(props.isError)){
      return props.isError as boolean
    }
    if (!arrayName) {
      const iName = inputName as keyof T
      return formik?.errors?.[iName] && formik?.touched?.[iName] ? true : false;
    } else {
      const iName = inputName as string
      const error = getIn(formik?.errors, iName)
      const touched = getIn(formik?.touched, iName)
      return error && touched ? true : false
    }
  }, [arrayName, getIn(formik?.errors, inputName as string), formik?.touched, inputName])

  const value = useMemo<Value>(() => {
    if (!arrayName) {
      const iName = inputName as keyof T
      return formik?.values?.[iName]
    } else {
      const iName = inputName as string
      const value = getIn(formik?.values, iName)
      return value
    }
  }, [arrayName, getIn(formik?.values, inputName as string), inputName])

  const formikErrorMessage = useMemo(() => {
    if (!arrayName) {
      const iName = inputName as keyof T
      return formik?.errors?.[iName]?.toString()
    } else {
      const iName = inputName as string
      const value = getIn(formik?.errors, iName) as string
      return value
    }
  }, [arrayName, getIn(formik?.errors, inputName as string), inputName])

  return {
    inputName: inputName,
    isError: isError,
    value: value,
    formikErrorMessage: formikErrorMessage
  }
}