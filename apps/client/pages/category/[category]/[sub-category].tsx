import { MUI } from "@shopifize/ui";
import Head from "next/head";
import { useRouter } from "next/router";
import { ReactElement } from "react";
import { Layout } from "~/components/layouts";
import { ProductBody } from "~/components/pages";
import { NextPageWithLayout } from "~/pages/_app";

const CategoryProductPage: NextPageWithLayout = () => {
  const router = useRouter();
  const categoryName = router.query.category;
  const subCategoryName = router.query["sub-category"];
  return (
    <>
      <Head>
        <title>
          {categoryName} - {subCategoryName}
        </title>
      </Head>
      <MUI.Container>
        <ProductBody />
      </MUI.Container>
    </>
  );
};

CategoryProductPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CategoryProductPage;
