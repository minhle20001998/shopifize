import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import { Layout } from "~/components/layouts";
import { ResetPasswordForm } from "~/components/pages";
import { MUI } from "@shopifize/ui";

const ResetPassword: NextPageWithLayout = () => {
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
        <ResetPasswordForm />
      </MUI.Stack>
    </MUI.Container>
  );
};

ResetPassword.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ResetPassword;
