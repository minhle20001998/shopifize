import { Stack, StackProps } from "@mui/material";
import React, { PropsWithChildren, Ref } from "react";

export const ModalContent = React.forwardRef(
  (props: PropsWithChildren<StackProps>, ref: Ref<HTMLDivElement>) => {
    const { children, ...delegated } = props;

    return (
      <Stack
        // className={roboto.className}
        {...delegated}
        direction={"column"}
        gap={"1rem"}
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "auto",
          bgcolor: "background.paper",
          boxShadow: 4,
          borderRadius: (theme) => theme.borderRadius[4],
          p: 3,
          ...delegated.sx
        }}
        ref={ref}
      >
        {children}
      </Stack>
    );
  }
);

ModalContent.displayName = "Modal Content";

export default ModalContent;
