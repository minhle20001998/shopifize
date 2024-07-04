import {
  CustomButton,
  CustomCard,
  CustomTypography,
  MUI,
  MUIIcon,
  useTheme,
} from "@shopifize/ui";
import { useProgress } from "~/hooks/useProgress";
import { useAuthQuery, useProfileQuery } from "queries";
import { useEffect, useState } from "react";
export const ChangePasswordContent = () => {
  const theme = useTheme();
  const { profile } = useProfileQuery();
  const [resend, setResend] = useState(false);

  const changePasswordOnSuccess = () => {
    !resend && nextStep();
  };

  const { changePassword } = useAuthQuery();
  const { step, nextStep } = useProgress({ totalSteps: 2 });
  const [canResend, setCanResend] = useState<boolean>(false);
  const [resendCountdown, setResendCountdown] = useState<number>(5);

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

  const handleVerify = async (resend?: boolean) => {
    setResend(!!resend);
    await changePassword.mutateAsync(undefined, {
      onSuccess: changePasswordOnSuccess,
    });
    setCanResend(true);
  };

  return (
    <CustomCard>
      <MUI.Stack direction={"column"} sx={{ height: "100%" }}>
        <CustomTypography
          fontSize={"header5"}
          sx={{
            fontWeight: theme.fontWeight.semiBold,
          }}
        >
          Change password
        </CustomTypography>
        <CustomTypography fontSize={"body2"}>
          Change your password,{" "}
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
        gap={"1rem"}
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
              onClick={() => handleVerify(false)}
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
            <CustomTypography fontSize={"body1"}>
              We&apos;ve sent an confirmation email to {profile?.email}
            </CustomTypography>
            <CustomTypography fontSize={"body1"}>
              Please response to that email
            </CustomTypography>
            <CustomButton
              fullWidth={false}
              disabled={Boolean(canResend)}
              onClick={() => handleVerify(true)}
            >
              {canResend ? `Resend in ${resendCountdown}s` : "Resend"}
            </CustomButton>
          </>
        ) : (
          <></>
        )}
      </MUI.Stack>
    </CustomCard>
  );
};
