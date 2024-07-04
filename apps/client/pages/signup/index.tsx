import { ReactElement } from "react";
import { SignupForm } from "~/components/pages/signup";
import { NextPageWithLayout } from "../_app";
import { Layout } from "~/components/layouts";
import { MUI } from "@shopifize/ui";

const LoginPage: NextPageWithLayout = () => {
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
        <SignupForm />
      </MUI.Stack>
    </MUI.Container>
  );
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default LoginPage;
