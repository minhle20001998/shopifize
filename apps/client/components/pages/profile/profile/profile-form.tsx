import { forwardRef, useState } from "react";

import useMobileScreen from "~/hooks/useMobileScreen";
import * as Yup from "yup";
import { GENDER, Profile, capitalize } from "@shopifize/helpers";
import { useFormik } from "formik";
import "yup-phone-lite";
import { useProfileQuery } from "queries";
import {
  CustomButton,
  CustomDOB,
  CustomInput,
  CustomLink,
  CustomPhoneInput,
  CustomRadio,
  MUI,
} from "@shopifize/ui";

enum Genders {
  FEMALE = "female",
  MALE = "male",
  OTHER = "other",
}

const validationSchema = Yup.object().shape({
  username: Yup.string().required("Username is required"),
  fullName: Yup.string().required("Full name is required"),
  phoneNumber: Yup.string()
    .phone("VN", "Please enter a valid phone number")
    .required("Phone number is required"),
  gender: Yup.mixed<GENDER>()
    .oneOf(Object.values(GENDER))
    .required()
    .nullable(),
  dob: Yup.date(),
});

export type ProfileValueType = Yup.InferType<typeof validationSchema>;

const ProfileForm = forwardRef<HTMLFormElement, unknown>((props, ref) => {
  const isMobile = useMobileScreen();
  const {
    profile,
    updateProfile,
    invalidate: invalidateProfile,
    enqueueSnackbar,
  } = useProfileQuery();
  const [disableButton, setDisableButton] = useState(false);
  const [disableCountdown, setDisableCountdown] = useState<number | false>(
    false
  );
  const initialValues: ProfileValueType = {
    username: profile?.username ?? "",
    fullName: profile?.fullName ?? "",
    phoneNumber: profile?.phoneNumber?.toString() ?? "",
    gender: profile?.gender ? profile.gender : null,
    dob: profile?.dob ? new Date(profile.dob) : undefined,
  };

  const startCountdown = () => {
    const countdown = () => {
      setDisableCountdown((prev) => {
        if (!prev) {
          return 5;
        } else {
          return prev - 1;
        }
      });
    };

    countdown();
    const intervalId = setInterval(() => {
      countdown();
    }, 1000);

    return intervalId;
  };

  const temporarilyDisableButton = () => {
    setDisableButton(true);
    const intervalId = startCountdown();
    setTimeout(() => {
      setDisableButton(false);
      clearInterval(intervalId);
      setDisableCountdown(false);
    }, 5000);
  };

  const handleSubmit = (values: ProfileValueType) => {
    updateProfile.mutate(values as Profile, {
      onSuccess: () => {
        invalidateProfile();
        temporarilyDisableButton();
        enqueueSnackbar("Profile updated succcessfully", {
          variant: "success",
        });
      },
    });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
    enableReinitialize: true,
  });

  return (
    <form ref={ref} onSubmit={formik.handleSubmit}>
      <MUI.Stack sx={{ width: isMobile ? "100%" : "50%" }}>
        <CustomInput
          label="Username"
          name="username"
          formik={formik}
          placeholder="Enter your username"
          aria-required
        />
        <CustomInput
          label="Full name"
          name="fullName"
          formik={formik}
          placeholder="Enter your full name"
          aria-required
        />
        <MUI.Stack direction={"row"} alignItems={"center"} gap={"1rem"}>
          <CustomInput
            label="Email"
            type="email"
            disabled
            defaultValue={profile?.email}
          />
          <CustomLink href={"/profile/change-email"} hoverStyle={"none"}>
            Change Email
          </CustomLink>
        </MUI.Stack>
        <CustomPhoneInput
          formik={formik}
          name="phoneNumber"
          label="Phone Number"
          aria-required
        />
        <CustomRadio
          label="Gender"
          options={[
            { label: capitalize(Genders.FEMALE), value: Genders.FEMALE },
            { label: capitalize(Genders.MALE), value: Genders.MALE },
            { label: capitalize(Genders.OTHER), value: Genders.OTHER },
          ]}
          name="gender"
          formik={formik}
          aria-required
        />
        <CustomDOB label="Date of birth" formik={formik} name="dob" />
        <CustomButton
          type="submit"
          sx={{
            width: isMobile ? "100%" : "50%",
            marginTop: "1rem",
            textTransform: "none",
          }}
          disabled={!formik.dirty || updateProfile.isLoading || disableButton}
        >
          {disableCountdown
            ? `Retry in ${disableCountdown}s`
            : "Submit".toUpperCase()}
        </CustomButton>
      </MUI.Stack>
    </form>
  );
});

ProfileForm.displayName = "Profile form";

export default ProfileForm;
