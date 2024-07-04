import {
  styled,
  Typography as MUITypography,
  TypographyProps,
  Theme,
} from "@mui/material";
import { useTheme } from "../../contexts";

const Typography = styled(MUITypography)(({ theme }) =>
  theme.unstable_sx({
    color: theme.customPalette.primaryText,
    lineHeight: "1.4rem",
  })
);

export type CustomTypographyProps = TypographyProps & {
  as?: React.ElementType;
  htmlFor?: string;
  href?: string;
  fontSize?: FS;
};

export type FS = keyof Theme["customTypography"]["fontSizes"];

export const CustomTypography = (props: CustomTypographyProps) => {
  const { children, ref, as, fontSize: fontSizeProp, ...delegated } = props;

  const theme = useTheme();

  const fontSize = fontSizeProp
    ? theme.customTypography.fontSizes[fontSizeProp as FS]
    : theme.customTypography.fontSizes.body2;

  return (
    <Typography
      as={as}
      ref={ref}
      {...delegated}
      sx={{
        fontFamily: theme.customTypography.fontFamily,
        fontSize,
        ...delegated.sx,
      }}
    >
      {children}
    </Typography>
  );
};
