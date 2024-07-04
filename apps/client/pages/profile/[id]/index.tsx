import { MUI } from "@shopifize/ui";
import { ProfileRoutes } from "const/routes";
import { ScreenSize } from "const/screen-size";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { ReactElement, useMemo } from "react";
import { Protected, Layout } from "~/components/layouts";
import {
  AddressesContent,
  ProfileContent,
  ChangePasswordContent,
  ProfileSidenav,
} from "~/components/pages";
import { ChangeEmailContent } from "~/components/pages/profile/change-email";
import useMobileScreen from "~/hooks/useMobileScreen";
import { NextPageWithLayout } from "~/pages/_app";

interface Props {
  mapAccessToken: string;
}

const PersonalProfile: NextPageWithLayout<Props> = (props: Props) => {
  const { mapAccessToken } = props;
  const router = useRouter();
  const isMobile = useMobileScreen(ScreenSize.md);

  const contents: Record<string, JSX.Element> = useMemo(() => {
    return {
      [ProfileRoutes.PROFILE]: <ProfileContent />,
      [ProfileRoutes.ADDRESS]: (
        <AddressesContent mapAccessToken={mapAccessToken} />
      ),
      [ProfileRoutes.CHANGE_PASSWORD]: <ChangePasswordContent />,
      [ProfileRoutes.CHANGE_EMAIL]: <ChangeEmailContent />,
    };
  }, [mapAccessToken]);

  return (
    <MUI.Container sx={{ marginTop: "1rem", marginBottom: "1rem" }}>
      <MUI.Grid container spacing={2}>
        {!isMobile ? (
          <MUI.Grid item md={2} xs={0}>
            <ProfileSidenav />
          </MUI.Grid>
        ) : (
          <></>
        )}
        <MUI.Grid item md={10} xs={12}>
          {contents[router.asPath]}
        </MUI.Grid>
      </MUI.Grid>
    </MUI.Container>
  );
};

PersonalProfile.getLayout = function getLayout(page: ReactElement) {
  return (
    <Layout>
      <Protected>{page}</Protected>
    </Layout>
  );
};

export const getServerSideProps: GetServerSideProps = () => {
  return Promise.resolve({
    props: {
      mapAccessToken: process.env.MAP_ACCESS_TOKEN,
    },
  });
};

export default PersonalProfile;
