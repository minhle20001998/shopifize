import { ReactElement } from "react";
import { Layout } from "~/components/layouts";
import { NextPageWithLayout } from "../_app";
import { ForgetPasswordForm } from "~/components/pages/forget-password/forget-password-form";
import { MUI } from "@shopifize/ui";

const ForgetPasswordPage: NextPageWithLayout = () => {
  return (
    <MUI.Container>
      <MUI.Stack
        sx={{
          height: "600px",
        }}
        direction={"row"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <ForgetPasswordForm />
      </MUI.Stack>
    </MUI.Container>
  );
};

ForgetPasswordPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ForgetPasswordPage;
