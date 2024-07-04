import Head from "next/head";
import { NextPageWithLayout } from "./_app";
import { ReactElement, useState } from "react";
import { DashboardLayout, Protected } from "~/components/layouts";
import { FileBrowser } from "~/components/common";
import { useSnackbar } from "notistack";
import { useFormik } from "formik";
import { GetServerSideProps } from "next";
import { CustomMap, LngLat } from "@shopifize/ui";

interface Props {
  mapAccessToken: string
}

const Home: NextPageWithLayout<Props> = (props: Props) => {
  const { mapAccessToken } = props;
  const snackbar = useSnackbar()
  const formik = useFormik({
    initialValues: { images: [], map: undefined },
    onSubmit: (value) => {
      console.log(value)
    }
  })

  const [p, setP] = useState<LngLat | null>(null)

  return (
    <>
      <Head>
        <title>Shopifize - Dashboard</title>
      </Head>
      <div style={{ height: '1200px' }}>
        <form onSubmit={formik.handleSubmit}>
          {/* <CustomInput label="Text" /> */}
          {/* <FileBrowserModal snackbar={snackbar} open={isOpen} handleClose={close} handleSubmit={() => { }} /> */}
          {/* <FileBrowser isMultiple label="Image" formik={formik} name="images" snackbar={snackbar} /> */}
          <button type='submit'>Submit</button>
          {/*  */}
          {/* <CustomOTP sx={{ width: '500px' }} /> */}
          {/*  */}
          <CustomMap formik={formik} name="map" accessToken={mapAccessToken} onMarkerChange={setP}/>
        </form>
        {p ? <p>{p.longitude}, {p.latitude}</p> : <></>}
      </div>
    </>
  );
};

Home.getLayout = function getLayout(page: ReactElement) {
  return <Protected>
    <DashboardLayout>{page}</DashboardLayout>
  </Protected>;
};

export const getServerSideProps: GetServerSideProps = () => {
  return Promise.resolve({
    props: {
      mapAccessToken: process.env.MAP_ACCESS_TOKEN,
    }
  })
}


export default Home;