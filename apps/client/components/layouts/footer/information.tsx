import React from "react";
import { default as NextLink, LinkProps } from "next/link";
import Image from "next/image";
import useMobileScreen from "~/hooks/useMobileScreen";
import { CustomTypography, MUI, MUIIcon } from "@shopifize/ui";

const InformationHeader = MUI.styled(CustomTypography)(({ theme }) =>
  theme.unstable_sx({
    fontSize: "1rem",
    color: "text.secondary",
  })
);

const InformationLink = MUI.styled(MUI.Link)(({ theme }) =>
  theme.unstable_sx({
    fontSize: "0.8rem",
    color: theme.customPalette?.main,
  })
);

const PAYMENT_METHOD_IMG_LINKS = [
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Visa_Inc._logo.svg/2560px-Visa_Inc._logo.svg.png",
    width: 50,
    height: 15,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a4/Mastercard_2019_logo.svg/1200px-Mastercard_2019_logo.svg.png",
    width: 35,
    height: 20,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/40/JCB_logo.svg/1280px-JCB_logo.svg.png",
    width: 40,
    height: 20,
  },
  {
    src: "https://upload.wikimedia.org/wikipedia/vi/f/fe/MoMo_Logo.png",
    width: 28,
    height: 28,
  },
  {
    src: "https://static.wikia.nocookie.net/logos/images/3/30/ZaloPay_logo.png/revision/latest?cb=20220212120745&path-prefix=vi",
    width: 28,
    height: 28,
  },
];

const Information = () => {
  const isMobileSize = useMobileScreen();

  return (
    <MUI.Grid container columns={20} spacing={isMobileSize ? 3 : 1}>
      <MUI.Grid item xs={10} sm={5} lg={4}>
        <MUI.Stack gap={"12px"}>
          <InformationHeader>Customer Service</InformationHeader>
          <InformationNextLink href={"#"}>
            Hotline: 1900-6996
          </InformationNextLink>
          <InformationNextLink href={"#"}>FAQ</InformationNextLink>
          <InformationNextLink href={"#"}>Request support</InformationNextLink>
          <InformationNextLink href={"#"}>How to buy</InformationNextLink>
          <InformationNextLink href={"#"}>Shipping</InformationNextLink>
          <InformationNextLink href={"#"}>Warrenty Policy</InformationNextLink>
        </MUI.Stack>
      </MUI.Grid>
      <MUI.Grid item xs={10} sm={5} lg={4}>
        <MUI.Stack gap={"12px"}>
          <InformationHeader>About Shopifize</InformationHeader>
          <InformationNextLink href={"#"}>About Us</InformationNextLink>
          <InformationNextLink href={"#"}>
            Shopifize Policies
          </InformationNextLink>
          <InformationNextLink href={"#"}>Privacy Policy</InformationNextLink>
        </MUI.Stack>
      </MUI.Grid>
      <MUI.Grid item xs={10} sm={5} lg={4}>
        <MUI.Stack gap={"12px"}>
          <InformationHeader>Certification</InformationHeader>
          <MUI.Stack direction={"row"} gap={"12px"} flexWrap={"wrap"}>
            <Image
              alt="cert"
              src={
                "https://lh3.googleusercontent.com/-hGef_N5LVNk/X_1bwdVFy4I/AAAAAAAAHhE/beD2hTDlgoM63dO5xfKadx-le6G1GqxogCLcBGAsYHQ/w1280-h800/ss9.png"
              }
              width={60}
              height={30}
            />
            <Image
              alt="cert"
              src={
                "https://static.vecteezy.com/system/resources/previews/014/585/856/original/certificate-luxury-golden-medal-png.png"
              }
              width={30}
              height={30}
            />
            <Image
              alt="cert"
              src={
                "https://zeevector.com/wp-content/uploads/2021/03/Certificate-Ribbon-PNG.png"
              }
              width={20}
              height={30}
            />
          </MUI.Stack>
        </MUI.Stack>
      </MUI.Grid>
      <MUI.Grid item xs={10} sm={5} lg={4}>
        <MUI.Stack gap={"12px"}>
          <InformationHeader>Payment</InformationHeader>
          <MUI.Stack
            direction={"row"}
            gap={"8px"}
            flexWrap={"wrap"}
            alignItems={"center"}
            paddingRight={"80px"}
          >
            {PAYMENT_METHOD_IMG_LINKS.map((img) => {
              return (
                <MUI.Box
                  key={img.src}
                  sx={{
                    "& img": {
                      transition: "all 0.4s",
                      filter: "grayscale(1)",
                    },
                    "&:hover img": {
                      filter: "grayscale(0)",
                    },
                  }}
                >
                  <Image
                    alt="payment"
                    src={img.src}
                    width={img.width}
                    height={img.height}
                  />
                </MUI.Box>
              );
            })}
          </MUI.Stack>
        </MUI.Stack>
      </MUI.Grid>
      <MUI.Grid item xs={10} sm={5} lg={4}>
        <MUI.Stack gap={"12px"}>
          <InformationHeader>Follow Us</InformationHeader>
          <MUI.Stack
            direction={"row"}
            gap={"4px"}
            flexWrap={"wrap"}
            alignItems={"center"}
            paddingRight={"80px"}
          >
            <NextLink aria-label="facebook link" href={"#"}>
              <MUIIcon.Facebook
                sx={{
                  transition: "all 0.4s",
                  filter: "grayscale(1)",
                  fontSize: "32px",
                  color: "#3b5998",
                  "&:hover": {
                    filter: "grayscale(0)",
                  },
                }}
              />
            </NextLink>
            <NextLink aria-label="youtube link" href={"#"}>
              <MUIIcon.YouTube
                sx={{
                  transition: "all 0.4s",
                  filter: "grayscale(1)",
                  fontSize: "32px",
                  color: "#ff0000",
                  "&:hover": {
                    filter: "grayscale(0)",
                  },
                }}
              />
            </NextLink>
            <NextLink aria-label="reddit link" href={"#"}>
              <MUIIcon.Reddit
                sx={{
                  transition: "all 0.4s",
                  filter: "grayscale(1)",
                  fontSize: "32px",
                  color: "#ff0000",
                  "&:hover": {
                    filter: "grayscale(0)",
                  },
                }}
              />
            </NextLink>
          </MUI.Stack>
        </MUI.Stack>
      </MUI.Grid>
    </MUI.Grid>
  );
};

interface InformationNextLink extends LinkProps {
  children: React.ReactNode;
}

const InformationNextLink = ({ children, ...rest }: InformationNextLink) => {
  return (
    <NextLink {...rest} passHref legacyBehavior>
      <InformationLink>{children}</InformationLink>
    </NextLink>
  );
};

export default Information;
