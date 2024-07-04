import { ReactElement } from "react";
import { Layout } from "~/components/layouts";
import { LoginForm } from "~/components/pages/login";
import { NextPageWithLayout } from "../_app";
import { MUI } from "@shopifize/ui";
import Head from "next/head";

const LoginPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Login</title>
      </Head>
      <MUI.Container>
        <MUI.Stack
          sx={{
            height: "600px",
          }}
          direction={"row"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          <LoginForm />
        </MUI.Stack>
      </MUI.Container>
    </>
  );
};

LoginPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default LoginPage;
