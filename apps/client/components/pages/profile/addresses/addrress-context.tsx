import { createContext, useContext } from "react";
import { OpenStateReturnType } from "~/hooks/useOpenState";

type AddressContextType = OpenStateReturnType;

export const useAddressContext = () => {
  return useContext(AddressContext);
};

export const AddressContext = createContext<AddressContextType>({
  itemId: undefined,
  isOpen: false,
  open: () => {},
  close: () => {},
});
