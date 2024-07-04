import { Button, ButtonProps } from "@mui/material";

type Props = ButtonProps;

export const CustomButton = (props: Props) => {
  const {
    ref,
    type = "button",
    variant = "contained",
    children,
    fullWidth = true,
    sx,
    ...delegated
  } = props;

  return (
    <Button
      ref={ref}
      fullWidth={fullWidth}
      type={type}
      variant={variant}
      sx={{
        textTransform: "none",
        boxShadow: 'none',
        fontSize: (theme) => theme.customTypography.fontSizes.body2,
        padding: '4px 8px',
        ...sx,
      }}
      {...delegated}
    >
      {children}
    </Button>
  );
};


CustomButton.displayName = "CustomButton";