import { useFormik } from "formik";
import { CSSProperties, useEffect, useRef } from "react";
import * as Yup from "yup";
import { IconProps } from "../../signup";
import { LOGIN_FAILED, ResponseType } from "@shopifize/helpers";
import Router from "next/router";
import { useAuthQuery, useInvalidateCartItems, useProfileQuery } from "queries";
import { useSearchParams } from "next/navigation";
import {
  CustomButton,
  CustomInput,
  CustomLink,
  CustomTypography,
  MUI,
  MUIIcon,
} from "@shopifize/ui";
import { authPubSubInstance } from "~/hooks/useShopifizedQuery";

const socialUrl =
  "https://deo.shopeemobile.com/shopee/shopee-pcmall-live-sg/assets/7b95007f3377150730bbb5d1ddb477d6.png";

const baseStyleForSocialDiv = {
  width: "22px",
  height: "22px",
};

const validationSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email Is Required"),
  password: Yup.string().required("Password Is Required"),
});

export type LoginValueType = Yup.InferType<typeof validationSchema>;

export const LoginForm = () => {
  const loginOnSuccess = async ({
    data,
    error,
  }: ResponseType<{ accessToken: string; refreshToken: string }>) => {
    if (error?.message === LOGIN_FAILED) {
      formik.setErrors({
        email: "Your email or password could be incorrect",
        password: " ",
      });
      return;
    }
    authPubSubInstance.publish(false);
    await invalidateCartItems();
    invalidate?.(() => {
      localStorage.setItem("refresh_token", data.refreshToken);
      void Router.push(redirectUrl);
    });
  };

  const { login } = useAuthQuery();
  const { invalidate } = useProfileQuery();
  const { invalidateCartItems } = useInvalidateCartItems();
  const emailInputRef = useRef<HTMLInputElement>(null);
  const searchParams = useSearchParams();

  const redirectUrl = searchParams.get("redirect") ?? "/";

  useEffect(() => {
    emailInputRef.current?.focus();
  }, []);

  const initialValues = {
    email: "",
    password: "",
  };

  const handleSubmit = (values: LoginValueType) => {
    login.mutate(values, { onSuccess: loginOnSuccess });
  };

  const formik = useFormik({
    initialValues,
    validationSchema,
    onSubmit: handleSubmit,
  });

  return (
    <MUI.Box
      sx={{
        width: "100%",
        maxWidth: "400px",
        backgroundColor: "common.white",
        padding: "1rem",
      }}
    >
      <form onSubmit={formik.handleSubmit}>
        <MUI.Stack gap={"1rem"}>
          <CustomTypography
            sx={{
              fontSize: "28px",
              fontWeight: "bold",
              color: "text.secondary",
              textAlign: "center",
            }}
          >
            Log In
          </CustomTypography>
          <MUI.Stack gap={"0.5rem"} sx={{ marginTop: "16px" }}>
            <CustomInput
              aria-required
              variant="standard"
              placeholder="Email"
              type="email"
              name="email"
              label="Email"
              helperText="Enter your email for login"
              formik={formik}
              startAdornment={<MUIIcon.Email sx={IconProps} />}
              inputRef={emailInputRef}
              visuallyHidden
            />
            <CustomInput
              aria-required
              variant="standard"
              placeholder="Password"
              type={"password"}
              name="password"
              label="Password"
              helperText="Enter your password for login"
              formik={formik}
              startAdornment={<MUIIcon.Lock sx={IconProps} />}
              visuallyHidden
            />
          </MUI.Stack>
          <MUI.Box sx={{ marginTop: "12px" }}>
            <MUI.Stack
              direction={"row"}
              justifyContent={"space-between"}
              sx={{ marginBottom: "0.4rem" }}
            >
              <CustomLink href={"/forget-password"}>
                Forget password ?
              </CustomLink>
              <CustomLink href={"/signup"}>
                Don&apos;t have an account ?
              </CustomLink>
            </MUI.Stack>
            <CustomButton
              fullWidth
              variant="contained"
              type="submit"
              disabled={login.isLoading}
            >
              Login
            </CustomButton>
          </MUI.Box>
          <MUI.Stack
            direction={"row"}
            justifyContent={"space-between"}
            gap={"1rem"}
            marginTop={"0.5rem"}
          >
            <SocialLinkButton
              title="Facebook"
              backgroundStyle={{
                backgroundImage: `url(${socialUrl})`,
                backgroundSize: "325% 287.5%",
                backgroundPosition: "5.555555555555555% 62.666666666666664%",
              }}
            />
            <SocialLinkButton
              title="Google"
              backgroundStyle={{
                backgroundImage: `url(${socialUrl})`,
                backgroundSize: "722.2222222222222% 638.8888888888889%",
                backgroundPosition: "83.92857142857143% 5.154639175257732%",
                ...baseStyleForSocialDiv,
              }}
            />
          </MUI.Stack>
        </MUI.Stack>
      </form>
    </MUI.Box>
  );
};

interface SocialLinkButtonProps {
  title: string;
  backgroundStyle: CSSProperties;
}

const SocialLinkButton = (props: SocialLinkButtonProps) => {
  return (
    <MUI.ButtonBase
      aria-label="login-submit"
      sx={{
        flex: 1,
        "&:hover, &:focus-visible": {
          background: "#f3f3f3",
        },
      }}
    >
      <MUI.Stack
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
        gap={"0.4rem"}
        sx={{
          width: "100%",
          border: "1px solid #dbdbdb",
          padding: "10px 8px",
          borderRadius: "4px",
        }}
      >
        <div
          style={{
            ...props.backgroundStyle,
            ...baseStyleForSocialDiv,
          }}
        />
        <CustomTypography fontSize={"body2"}>{props.title}</CustomTypography>
      </MUI.Stack>
    </MUI.ButtonBase>
  );
};
