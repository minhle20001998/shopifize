import { CustomTypography, MUI, useTheme } from "@shopifize/ui";
import React from "react";

const Intro = () => {
  const theme = useTheme();

  return (
    <MUI.Stack gap={"6px"}>
      <CustomTypography
        fontSize={"body1"}
        sx={{
          color: theme.customPalette.primaryText,
          marginBottom: "4px",
        }}
      >
        Shopifize - Buy anything you like
      </CustomTypography>
      <CustomTypography fontSize={"body2"}>
        <b>Disclaimer : </b>This is a copied version of some shopping websites
        for the user&apos;s personal, non-commercial use. If there is any
        copyright issue with this website, please contact me at
        minhle20001998@gmail.com for removal
      </CustomTypography>
      <br />
      <CustomTypography
        fontSize={"header5"}
        sx={{
          color: theme.customPalette.primaryText,
        }}
      >
        Buy anything, anywhere !
      </CustomTypography>
      <CustomTypography fontSize={"body2"}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum
      </CustomTypography>
      <br />
      <CustomTypography
        fontSize={"header5"}
        sx={{
          color: theme.customPalette.primaryText,
        }}
      >
        Safety and privacy first
      </CustomTypography>
      <CustomTypography fontSize={"body2"}>
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters, as opposed to using &apos;Content here, content here&apos;,
        making it look like readable English. Many desktop publishing packages
        and web page editors now use Lorem Ipsum as their default model text,
        and a search for &apos;lorem ipsum&apos; will uncover many web sites
        still in their infancy. Various versions have evolved over the years,
        sometimes by accident, sometimes on purpose (injected humour and the
        like).
      </CustomTypography>
      <ul style={{ paddingInlineStart: "40px" }}>
        <li>
          <CustomTypography fontSize={"body2"}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit,
          </CustomTypography>
        </li>
        <li>
          <CustomTypography fontSize={"body2"}>
            sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </CustomTypography>
        </li>
        <li>
          <CustomTypography fontSize={"body2"}>
            Ut enim ad minim veniam
          </CustomTypography>
        </li>
      </ul>
      <br />
      <CustomTypography fontSize={"header5"}>
        Authentic goods from big brands
      </CustomTypography>
      <CustomTypography fontSize={"body2"}>
        Lorem Ipsum is simply dummy text of the printing and typesetting
        industry. Lorem Ipsum has been the industry&apos;s standard dummy text
        ever since the 1500s, when an unknown printer took a galley of type and
        scrambled it to make a type specimen book. It has survived not only five
        centuries, but also the leap into electronic typesetting, remaining
        essentially unchanged. It was popularised in the 1960s with the release
        of Letraset sheets containing Lorem Ipsum passages, and more recently
        with desktop publishing software like Aldus PageMaker including versions
        of Lorem Ipsum
      </CustomTypography>
      <CustomTypography fontSize={"body2"}>
        It is a long established fact that a reader will be distracted by the
        readable content of a page when looking at its layout. The point of
        using Lorem Ipsum is that it has a more-or-less normal distribution of
        letters, as opposed to using &apos;Content here, content here&apos;,
        making it look like readable English. Many desktop publishing packages
        and web page editors now use Lorem Ipsum as their default model text,
        and a search for &apos;lorem ipsum&apos; will uncover many web sites
        still in their infancy. Various versions have evolved over the years,
        sometimes by accident, sometimes on purpose (injected humour and the
        like).
      </CustomTypography>
    </MUI.Stack>
  );
};

export default Intro;
