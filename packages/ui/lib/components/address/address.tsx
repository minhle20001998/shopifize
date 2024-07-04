import {
  Box,
  FormControl,
  FormHelperText,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { Ref, useEffect, useMemo, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { isNil } from "@shopifize/helpers";
import { FormikProps } from "formik";
import { CustomSelect, CustomTypography } from "..";

const BASE_API_URL = "https://provinces.open-api.vn/api";

const DEFAULT_VALUE = "none";

export const VietnameseProvincesQueryKey = ["get-vietnamese-provinces"];
export const VietnameseDistrictQueryKey = ["get-vietnamese-districts"];
export const VietnameseWardQueryKey = ["get-vietnamese-wards"];

interface Props<T> {
  value?: string | null;
  visuallyHidden?: boolean;
  label?: string;
  name?: keyof T;
  errorMessage?: string | undefined | null;
  formik?: FormikProps<T>;
  helperText?: string;
  ref?: Ref<HTMLDivElement>;
  onChange?: (value: string | null) => void;
}

export type ProvinceType = {
  code: number;
  codename: string;
  districts: DistrictType[];
  division_type: string;
  name: string;
  phone_code: number;
};

export type DistrictType = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  province_code: number;
  wards: WardType[];
};

export type WardType = {
  name: string;
  code: number;
  division_type: string;
  codename: string;
  district_code: number;
};

export type MappingAddress = { [index: number]: string };

export type CustomAddressProps<T> = Props<T>;

export const CustomAddress = <T,>(props: CustomAddressProps<T>) => {
  const {
    visuallyHidden,
    label,
    onChange,
    name,
    value,
    formik,
    ref,
    helperText,
  } = props;
  const inputName = name ?? ("" as keyof T);
  const formikValue = formik?.values[inputName] as string | undefined;

  const [provinceValue, districtValue, wardValue] = value
    ? value.split(", ")
    : formikValue
      ? formikValue.split(", ")
      : [];

  const [province, setProvince] = useState<number | undefined>(undefined);
  const [district, setDistrict] = useState<number | undefined>(undefined);
  const [ward, setWard] = useState<number | undefined>(undefined);
  const firstRenderProvince = useRef(false);
  const firstRenderDistrict = useRef(false);
  const firstRenderWard = useRef(false);

  useEffect(() => {
    if (isNil(provinceValue)) {
      return;
    }
    if (!firstRenderProvince.current) {
      void fetchInitialValue("province", provinceValue);
    }
    firstRenderProvince.current = true;
  }, [provinceValue]);

  useEffect(() => {
    if (isNil(districtValue)) {
      return;
    }
    if (!firstRenderDistrict.current) {
      void fetchInitialValue("district", districtValue);
    }
    firstRenderDistrict.current = true;
  }, [districtValue]);

  useEffect(() => {
    if (isNil(wardValue) || isNil(district)) {
      return;
    }
    if (!firstRenderWard.current) {
      void fetchInitialValue("ward", wardValue, district?.toString());
    }
    firstRenderWard.current = true;
  }, [wardValue, district]);

  const fetchInitialValue = async (
    type: "province" | "district" | "ward",
    value: string,
    districtCode?: string
  ) => {
    if (type === "province") {
      const { data } = await axios.get<{ name: string; code: number }[]>(
        `${BASE_API_URL}/p/search/?q=%2B${value}&p=1`
      );
      setProvince(data?.[0]?.code);
    } else if (type === "district") {
      const { data } = await axios.get<{ name: string; code: number }[]>(
        `${BASE_API_URL}/d/search/?q=%2B${value}`
      );
      setDistrict(data?.[0]?.code);
    } else if (type === "ward" && districtCode) {
      const { data } = await axios.get<{ name: string; code: number }[]>(
        `${BASE_API_URL}/w/search/?q=%2B${encodeURIComponent(
          value
        )}&d=${encodeURIComponent(districtCode)}`
      );
      setWard(data?.[0]?.code);
    }
  };

  const { data: provinces, dataUpdatedAt: provincesQueryId } = useQuery(
    VietnameseProvincesQueryKey,
    async () => {
      const response = await axios.get<ProvinceType[]>(`${BASE_API_URL}/p/`);
      return response.data;
    },
    {
      refetchOnWindowFocus: false,
    }
  );

  const mappingProvinces = useMemo(() => {
    return provinces?.reduce((acc, current) => {
      return Object.assign(acc, { [current.code]: current.name });
    }, {}) as MappingAddress;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [provincesQueryId]);

  const { data: districts, dataUpdatedAt: districtQueryId } = useQuery(
    [VietnameseDistrictQueryKey.toString(), province],
    async () => {
      const response = await axios.get<ProvinceType>(
        `${BASE_API_URL}/p/${Number(province)}`,
        { params: { depth: 2 } }
      );

      return response.data.districts;
    },
    { enabled: !!province, refetchOnWindowFocus: false }
  );

  const mappingDistricts = useMemo(() => {
    return districts?.reduce((acc, current) => {
      return Object.assign(acc, { [current.code]: current.name });
    }, {}) as MappingAddress;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [districtQueryId]);

  const { data: wards, dataUpdatedAt: wardQueryId } = useQuery(
    [VietnameseWardQueryKey.toString(), district],
    async () => {
      const response = await axios.get<DistrictType>(
        `${BASE_API_URL}/d/${Number(district)}`,
        { params: { depth: 2 } }
      );

      return response.data.wards;
    },
    { enabled: !!district, refetchOnWindowFocus: false }
  );

  const mappingWards = useMemo(() => {
    return wards?.reduce((acc, current) => {
      return Object.assign(acc, { [current.code]: current.name });
    }, {}) as MappingAddress;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [wardQueryId]);

  const validateAddress = (
    province: number | undefined,
    district: number | undefined,
    ward: number | undefined
  ) => {
    return !isNil(province) && !isNil(district) && !isNil(ward);
  };

  const handleChange = (
    province: number | undefined,
    district: number | undefined,
    ward: number | undefined
  ) => {
    if (validateAddress(province, district, ward)) {
      const address =
        mappingProvinces[province!].toString() +
        ", " +
        mappingDistricts[district!].toString() +
        ", " +
        mappingWards[ward!].toString();
      onChange?.(address);
      formik?.setFieldValue(inputName.toString(), address);
    } else {
      onChange?.(null);
      formik?.setFieldValue(inputName.toString(), null);
    }
  };

  const handleProvinceChange = (e: SelectChangeEvent<unknown>) => {
    const provinceInput = Number(e.target.value);
    setProvince(provinceInput);
    setDistrict(undefined);
    setWard(undefined);
    onChange?.(null);
  };

  const handleDistrictChange = (e: SelectChangeEvent<unknown>) => {
    const districtInput = Number(e.target.value);
    setDistrict(districtInput);
    setWard(undefined);
    onChange?.(null);
  };

  const handleWardChange = (e: SelectChangeEvent<unknown>) => {
    const wardInput = Number(e.target.value);
    setWard(wardInput);
    handleChange(province, district, wardInput);
  };

  const isError =
    formik?.errors?.[inputName] && formik?.touched?.[inputName] ? true : false;

  return (
    <Box ref={ref}>
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
              value={province ?? DEFAULT_VALUE}
              onChange={handleProvinceChange}
              onBlur={formik?.handleBlur}
              options={provinces?.map((province) => {
                return {
                  id: province.code,
                  label: province.name
                }
              })}
              placeholderOption={{
                id: DEFAULT_VALUE,
                label: 'City'
              }}
            />
            {isError ? (
              <FormHelperText
                sx={{
                  padding: 0,
                  margin: 0,
                  marginTop: "4px",
                }}
              >
                Invalid address
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
        <Stack direction={"column"} sx={{ flex: 1 }}>
          <FormControl error={isError}>
            <CustomSelect
              value={district ?? DEFAULT_VALUE}
              onChange={handleDistrictChange}
              onBlur={formik?.handleBlur}
              options={districts?.map((district) => {
                return {
                  id: district.code,
                  label: district.name
                }
              })}
              placeholderOption={{
                id: DEFAULT_VALUE,
                label: 'District'
              }}
            />
          </FormControl>
        </Stack>
        <Stack direction={"column"} sx={{ flex: 1 }}>
          <FormControl error={isError}>
            <CustomSelect
              value={ward ?? DEFAULT_VALUE}
              onChange={handleWardChange}
              onBlur={formik?.handleBlur}
              options={wards?.map((ward) => {
                return {
                  id: ward.code,
                  label: ward.name
                }
              })}
              placeholderOption={{
                id: DEFAULT_VALUE,
                label: 'Ward'
              }}
            />
          </FormControl>
        </Stack>
      </Stack>
    </Box >
  );
};

CustomAddress.displayName = "Custom Address";


