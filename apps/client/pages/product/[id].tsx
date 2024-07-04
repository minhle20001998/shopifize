import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import { Layout } from "~/components/layouts";
import Head from "next/head";
import { MUI } from "@shopifize/ui";
import { ProductDetailContent } from "~/components/pages/product-detail";
import { useRouter } from "next/router";

const ProductDetailPage: NextPageWithLayout = () => {
  const router = useRouter();
  const id = router.query.id?.toString();

  return (
    <>
      <Head>
        <title>Product Detail</title>
      </Head>
      <MUI.Container>
        <ProductDetailContent id={id} />
      </MUI.Container>
    </>
  );
};

ProductDetailPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default ProductDetailPage;
