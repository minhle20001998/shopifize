import {
  Box,
  FormControl,
  FormHelperText,
  SelectChangeEvent,
  Stack,
  SxProps,
  Theme,
} from "@mui/material";
import { useMemo, useState } from "react";
import dayjs from "dayjs";
import { FormikProps } from "formik";
import { CustomTypography } from "../typography";
import { isNil } from "@shopifize/helpers";
import { MIN_YEAR } from "../../const";
import { CustomSelect } from "..";

const DEFAULT_VALUE = "none";

interface DOBProps<T> {
  value?: Date | null;
  sx?: SxProps<Theme>;
  name?: keyof T;
  errorMessage?: string | undefined | null;
  formik?: FormikProps<T>;
  helperText?: string;
  label?: string;
  visuallyHidden?: boolean;
  ref?: React.ForwardedRef<HTMLDivElement>;
  onChange?: (value: Date | null) => void;
} 

function getDaysInMonth(year: number, month: number) {
  const startDate = dayjs().year(year).month(month).date(1); // Set the start date to the 1st day of the specified month and year
  const numDays = startDate.daysInMonth(); // Get the total number of days in the month

  // Create an array of days using Array.from
  const daysArray = Array.from({ length: numDays }, (_, index) =>
    startDate.add(index, "day").format("YYYY-MM-DD")
  );

  return daysArray;
}

export const CustomDOB = <T,>(props: DOBProps<T>) => {
  const {
    value,
    sx,
    formik,
    helperText,
    label,
    visuallyHidden,
    name,
    ref,
    onChange,
  } = props;
  const inputName = name ?? ("" as keyof T);
  const formikValue = formik?.values[inputName] as Date;
  const dateProps = value?.getDate() ?? formikValue?.getDate();
  const monthProps = value?.getMonth() ?? formikValue?.getMonth();
  const yearProps = value?.getFullYear() ?? formikValue?.getFullYear();
  const [dateValue, setDateValue] = useState(dateProps ?? null);
  const [monthValue, setMonthValue] = useState(monthProps ?? null);
  const [yearValue, setYearValue] = useState(yearProps ?? null);
  const [isError, setIsError] = useState(false);
  const validateDays = (
    yearValue: number,
    monthValue: number,
    dateValue: number
  ) => {
    if (!isNil(yearValue) && !isNil(monthValue) && !isNil(dateValue)) {
      const daysInMonth = getDaysInMonth(yearValue, monthValue);
      if (dateValue <= daysInMonth.length) {
        setIsError(false);
        return true;
      } else {
        setIsError(true);
        return false;
      }
    } else {
      return false;
    }
  };

  const handleOnChange = (
    yearValue: number,
    monthValue: number,
    dateValue: number
  ) => {
    if (validateDays(yearValue, monthValue, dateValue)) {
      const dobValue = new Date(yearValue, monthValue, dateValue + 1);
      onChange?.(dobValue);
      formik?.setFieldValue(inputName.toString(), dobValue);
    } else {
      onChange?.(null);
      formik?.setFieldValue(inputName.toString(), null);
    }
  };

  const months = useMemo(() => {
    return getMonthsFullLength();
  }, []);

  const years = useMemo(() => {
    return getYears(MIN_YEAR, new Date().getFullYear());
  }, []);

  const days =
    yearValue && monthValue
      ? getDates(yearValue, monthValue + 1)
      : getDates(2000, 8);

  const handleDateChange = (event: SelectChangeEvent<unknown>) => {
    const newDate = parseInt(event.target.value as string);
    setDateValue(newDate);
    handleOnChange(yearValue, monthValue, newDate);
  };

  const handleMonthChange = (event: SelectChangeEvent<unknown>) => {
    const newMonth = parseInt(event.target.value as string);
    setMonthValue(newMonth);
    handleOnChange(yearValue, newMonth, dateValue);
  };

  const handleYearChange = (event: SelectChangeEvent<unknown>) => {
    const newYear = parseInt(event.target.value as string);
    setYearValue(parseInt(event.target.value as string));
    handleOnChange(newYear, monthValue, dateValue);
  };

  return (
    <Box sx={sx} ref={ref}>
      <CustomTypography
        as={"label"}
        className={visuallyHidden ? "visually-hidden" : ""}
        sx={{ marginBottom: "0.2rem" }}
      >
        {label}
      </CustomTypography>
      <Stack direction={"row"} gap={"1rem"}>
        <Stack direction={"column"} sx={{ flex: 1 }}>
          <FormControl error={isError}>
            <CustomSelect
              value={dateValue?.toString() ?? "none"}
              onChange={handleDateChange}
              options={days.map((day) => {
                return {id: day, label: day}
              })}
            />
            {isError ? (
              <FormHelperText
                sx={{
                  padding: 0,
                  margin: 0,
                  marginTop: "4px",
                }}
              >
                Invalid Date
              </FormHelperText>
            ) : (
              <Box sx={{ height: "24px" }}>
                <FormHelperText
                  sx={{ padding: 0, margin: 0, marginTop: "4px" }}
                  className={visuallyHidden ? "visually-hidden" : ""}
                >
                  {helperText}
                </FormHelperText>
              </Box>
            )}
          </FormControl>
        </Stack>
        <CustomSelect
          value={monthValue?.toString() ?? DEFAULT_VALUE}
          onChange={handleMonthChange}
          options={months.map((month, index) => {return {id: index, label: month}})}
          sx={{ flex: 1 }}
        />
        <CustomSelect
          value={yearValue?.toString() ?? "none"}
          onChange={handleYearChange}
          options={years.map((year) => {return {id: year, label: year.toString()}})}
          sx={{ flex: 1 }}
        //   <MenuItem value={"none"} disabled>
        //   Year
        // </MenuItem>
        />
      </Stack>
    </Box>
  );
};

const getDates = (year: number, month: number) => {
  const startDate = dayjs(`${year}-${month}-01`);
  const endDate = startDate.endOf("month");
  const totalDays = endDate.date();

  return Array.from({ length: totalDays }, (_, index) =>
    startDate.add(index, "day").format("DD")
  );
};

const getMonthsFullLength = () => {
  const months = [];
  for (let month = 0; month < 12; month++) {
    const monthName = dayjs().month(month).format("MMMM");
    months.push(monthName);
  }
  return months;
};

const getYears = (startYear: number, endYear: number) => {
  const years = [];
  for (let year = startYear; year <= endYear; year++) {
    years.push(year);
  }
  return years;
};