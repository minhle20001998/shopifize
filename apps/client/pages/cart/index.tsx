import { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";
import { Layout } from "~/components/layouts";
import { MUI } from "@shopifize/ui";
import Head from "next/head";
import { CartProducts, CartSummary } from "~/components/pages/cart";
import CartProvider from "~/contexts/CartContext";

const CartPage: NextPageWithLayout = () => {
  return (
    <>
      <Head>
        <title>Cart</title>
      </Head>
      <CartProvider>
        <MUI.Container sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
          <MUI.Grid container spacing={"1rem"}>
            <MUI.Grid item lg={8} sm={12}>
              <CartProducts />
            </MUI.Grid>
            <MUI.Grid item lg={4} sm={12}>
              <CartSummary />
            </MUI.Grid>
          </MUI.Grid>
        </MUI.Container>
      </CartProvider>
    </>
  );
};

CartPage.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};

export default CartPage;
