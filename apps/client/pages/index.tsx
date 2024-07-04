import type { ReactElement } from "react";
import {
  Carousel,
  Categories,
  Daily,
  TopViewed,
} from "~/components/pages/homepage";
import type { NextPageWithLayout } from "./_app";
import Head from "next/head";
import { Layout } from "~/components/layouts";
import { MUI } from "@shopifize/ui";

const Home: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Shopifize</title>
      </Head>
      <MUI.Stack gap={"12px"} marginBottom={"12px"}>
        <Carousel />
        <MUI.Container>
          <Categories />
        </MUI.Container>
        <MUI.Container>
          <TopViewed />
        </MUI.Container>
        <MUI.Container>
          <Daily />
        </MUI.Container>
      </MUI.Stack>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default Home;
