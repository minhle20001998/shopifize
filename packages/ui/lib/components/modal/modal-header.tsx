import { PropsWithChildren } from "react";
import { CustomTypography } from "../typography";

export const ModalHeader = (props: PropsWithChildren) => {
  return (
    <CustomTypography fontSize={"body1"}>{props.children}</CustomTypography>
  );
};

export default ModalHeader;
