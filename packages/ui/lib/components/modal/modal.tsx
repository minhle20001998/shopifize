import React, { useMemo } from "react";
import { Box, Modal, ModalProps, Stack, SxProps, Theme } from "@mui/material";
import { ModalActions, ModalActionsProps } from "./modal-actions";
import ModalContent from "./modal-content";
import ModalHeader from "./modal-header";
interface Props {
  title?: string | React.ReactNode;
  actionsProps?: ModalActionsProps;
  children?: React.ReactNode;
  size?: 'sm' | 'md' | 'lg'
  bodySx?: SxProps<Theme>
}

export type CustomModalProps = Props & Omit<ModalProps, keyof Props>;

export const CustomModal = React.forwardRef<HTMLDivElement, CustomModalProps>(
  (props, ref) => {
    const { children, title, actionsProps, size, bodySx, ...delegated } = props;

    const sizeSx = useMemo(() => {
      const widths = {
        sm: 600,
        md: 800,
        lg: 1000
      }

      return size ? {
        width: '100%',
        maxWidth: widths[size]
      } : {}
    }, [size])

    return (
      <Modal ref={ref} sx={{ ...delegated.sx, margin: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} {...delegated}>
        <ModalContent sx={{ ...sizeSx, position: 'static', transform: 'unset', ...bodySx, maxHeight: '80vh', overflow: 'auto' }}>
          <Stack direction={"column"} gap={"1rem"} height={'100%'}>
            <ModalHeader>{title}</ModalHeader>
            <Box sx={{ flex: 1}}>{children}</Box>
            <ModalActions {...actionsProps} />
          </Stack>
        </ModalContent>
      </Modal>
    );
  }
);

CustomModal.displayName = "Custom Modal";

export default CustomModal;
