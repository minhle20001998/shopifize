import { ButtonProps, Stack } from "@mui/material";
import { CustomButton } from "..";

interface ActionButtonProps extends ButtonProps {
  content?: string;
}

interface Props {
  applyButtonProps?: ActionButtonProps;
  cancelButtonProps?: ActionButtonProps;
}

export type ModalActionsProps = Props;

export const ModalActions = (props: ModalActionsProps) => {
  const { applyButtonProps, cancelButtonProps } = props;

  const applyButtonContent = applyButtonProps?.content ?? "Apply";
  const cancelButtonContent = cancelButtonProps?.content ?? "Cancel";

  return (
    <Stack
      sx={{ marginLeft: "auto", marginTop: "1rem" }}
      direction={"row"}
      gap={"1rem"}
    // className={roboto.className}
    >
      {cancelButtonProps
        ? <CustomButton variant="outlined" {...cancelButtonProps}>
          {cancelButtonContent}
        </CustomButton>
        : <></>
      }
      {applyButtonProps
        ? <CustomButton {...applyButtonProps}>{applyButtonContent}</CustomButton>
        : <></>
      }
    </Stack>
  );
};


