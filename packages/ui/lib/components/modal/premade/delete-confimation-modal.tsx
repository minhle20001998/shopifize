import { PropsWithChildren } from "react"
import { CustomModal, CustomModalProps } from ".."
import { CustomTypography } from "../.."

interface Props extends CustomModalProps {
  title: string
  handleDelete: () => void
  handleClose: () => void
}

export const DeleteConfirmationModal = ({ children, title, open, handleDelete, handleClose, ...delegated }: PropsWithChildren<Props>) => {
  return <CustomModal
    {...delegated}
    title={title}
    open={open}
    onClose={handleClose}
    actionsProps={{
      applyButtonProps: {
        content: "Delete",
        color: "error",
        type: "button",
        onClick: handleDelete,
      },
      cancelButtonProps: {
        variant: "text",
        sx: { color: (theme) => theme.customPalette.grey100 },
        onClick: handleClose,
      },
    }}
  >
    <CustomTypography>{children}</CustomTypography>
  </CustomModal>
}