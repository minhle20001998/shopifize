import { useEffect, useState } from "react";

import { useProgress } from "~/hooks/useProgress";
import { useAuthQuery, useProfileQuery } from "queries";
import { useFormik } from "formik";
import * as Yup from "yup";
import { ResponseType, hideEmail } from "@shopifize/helpers";
import {
  CustomButton,
  CustomCard,
  CustomInput,
  CustomOTP,
  CustomTypography,
  MUI,
  MUIIcon,
  useTheme,
} from "@shopifize/ui";

const newEmailValidationSchema = Yup.object().shape({
  newEmail: Yup.string().email("Invalid email").required("Email Is Required"),
});

export type NewEmailValueType = Yup.InferType<typeof newEmailValidationSchema>;

export const ChangeEmailContent = () => {
  const theme = useTheme();
  const { profile, invalidate: invalidateProfile } = useProfileQuery();
  const [resend, setResend] = useState(false);

  const {
    requestEmailChangeOTP,
    requestNewEmailVerifyOTP,
    checkEmailOTP,
    checkNewEmailOTP,
    enqueueSnackbar,
  } = useAuthQuery();
  const { step, moveToStep, nextStep } = useProgress({ totalSteps: 4 });
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(5);
  const [otp, setOtp] = useState("");
  const [newEmailOtp, setNewEmailOtp] = useState("");

  useEffect(() => {
    let id: NodeJS.Timer;
    if (canResend) {
      id = setInterval(() => {
        setResendCountdown((prev) => {
          if (prev && prev > 0) {
            return prev - 1;
          } else {
            setCanResend(false);
            return 5;
          }
        });
      }, 1000);
    }
    return () => {
      clearInterval(id);
    };
  }, [canResend]);

  const checkNewEmailOTPOnSuccess = (data: ResponseType<boolean>) => {
    const success = data.success;
    if (success) {
      enqueueSnackbar("Your Email has changed successfully", {
        variant: "success",
      });
      invalidateProfile();
      handleReset();
    } else {
      enqueueSnackbar(data.error?.message, {
        variant: "error",
      });
      handleReset();
    }
  };

  const requestEmailChangeOnSuccess = () => {
    !resend && nextStep();
    setCanResend(true);
  };

  const submitNewEmailOnSuccess = () => {
    nextStep();
  };

  const handleSendMail = (resend?: boolean) => {
    setResend(!!resend);
    requestEmailChangeOTP.mutate(undefined, {
      onSuccess: requestEmailChangeOnSuccess,
    });
  };

  const handleReset = () => {
    setOtp("");
    moveToStep(0);
    setOtp("");
    setNewEmailOtp("");
    newEmailFormik.resetForm();
  };

  const handleCheckOTP = (otp: string) => {
    checkEmailOTP.mutate(
      { otp },
      {
        onSuccess: (data) => {
          if (data.success) {
            nextStep();
          } else {
            enqueueSnackbar(data.error?.message, {
              variant: "error",
            });
            handleReset();
          }
        },
      }
    );
  };

  const handleCheckNewEmailOTP = (otp: string) => {
    checkNewEmailOTP.mutate(
      { otp, email: newEmailFormik.values.newEmail },
      {
        onSuccess: checkNewEmailOTPOnSuccess,
      }
    );
  };

  const handleSubmitNewEmail = (values: NewEmailValueType) => {
    requestNewEmailVerifyOTP.mutate(values.newEmail, {
      onSuccess: submitNewEmailOnSuccess,
    });
  };

  const newEmailInitialValue: NewEmailValueType = {
    newEmail: "",
  };

  const newEmailFormik = useFormik({
    initialValues: newEmailInitialValue,
    validationSchema: newEmailValidationSchema,
    onSubmit: handleSubmitNewEmail,
  });

  return (
    <CustomCard>
      <MUI.Stack direction={"column"} sx={{ height: "100%" }}>
        <CustomTypography
          fontSize={"header5"}
          sx={{
            fontWeight: theme.fontWeight.semiBold,
          }}
        >
          Change email
        </CustomTypography>
        <CustomTypography fontSize={"body2"}>
          Change your Email,{" "}
          <CustomTypography
            as={"span"}
            fontSize={"body2"}
            sx={{ color: theme.customPalette.main }}
          >
            will force logout every instance of your account
          </CustomTypography>
        </CustomTypography>
      </MUI.Stack>
      <MUI.Stack
        direction={"column"}
        alignItems={"center"}
        sx={{ padding: "2rem" }}
        gap={"2rem"}
      >
        {step === 0 ? (
          <>
            <MUIIcon.VerifiedUser
              sx={{ fontSize: "80px", color: theme.customPalette.main }}
            />
            <CustomTypography fontSize={"body1"}>
              To protect your account, please verify your identity
            </CustomTypography>
            <CustomButton
              fullWidth={false}
              startIcon={<MUIIcon.Mail />}
              onClick={() => {
                handleSendMail(false);
              }}
            >
              Verify by Email Link
            </CustomButton>
          </>
        ) : (
          <></>
        )}
        {step === 1 ? (
          <>
            <MUIIcon.MailLock
              sx={{ fontSize: "80px", color: theme.customPalette.main }}
            />
            <MUI.Stack gap={"1rem"}>
              <CustomTypography fontSize={"body1"} sx={{ textAlign: "center" }}>
                We&apos;ve sent an confirmation email to {profile?.email}
              </CustomTypography>
              <CustomTypography fontSize={"body1"} sx={{ textAlign: "center" }}>
                Please enter the OTP in sent email
              </CustomTypography>
            </MUI.Stack>
            <CustomOTP
              value={otp}
              onChange={setOtp}
              length={5}
              onComplete={handleCheckOTP}
            />
            <CustomButton
              fullWidth={false}
              disabled={Boolean(canResend)}
              onClick={() => {
                handleSendMail(true);
              }}
              variant="text"
            >
              {canResend ? `Resend in ${resendCountdown}s` : "Resend"}
            </CustomButton>
          </>
        ) : (
          <></>
        )}
        {step === 2 ? (
          <MUI.Stack sx={{ maxWidth: "280px", width: "100%" }}>
            <form onSubmit={newEmailFormik.handleSubmit}>
              <CustomInput
                name="newEmail"
                placeholder="New email"
                formik={newEmailFormik}
              />
              <CustomButton type="submit">Submit</CustomButton>
            </form>
          </MUI.Stack>
        ) : (
          <></>
        )}
        {step === 3 ? (
          <>
            <MUIIcon.MailLock
              sx={{ fontSize: "80px", color: theme.customPalette.main }}
            />
            <MUI.Stack gap={"1rem"}>
              <CustomTypography fontSize={"body1"} sx={{ textAlign: "center" }}>
                We&apos;ve sent an confirmation email to your new email
                {hideEmail(newEmailFormik.values.newEmail)}
              </CustomTypography>
              <CustomTypography fontSize={"body1"} sx={{ textAlign: "center" }}>
                Please enter the OTP in sent email
              </CustomTypography>
            </MUI.Stack>
            <CustomOTP
              value={newEmailOtp}
              onChange={setNewEmailOtp}
              length={5}
              onComplete={handleCheckNewEmailOTP}
            />
          </>
        ) : (
          <></>
        )}
      </MUI.Stack>
    </CustomCard>
  );
};
