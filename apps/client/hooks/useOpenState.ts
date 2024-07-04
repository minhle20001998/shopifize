import { useState } from "react";

export interface OpenStateReturnType {
  itemId: string | undefined;
  isOpen: boolean;
  open: (id?: string) => void;
  close: () => void;
}

export const useOpenState = (): OpenStateReturnType => {
  const [itemId, setItemId] = useState<string | undefined>(undefined);
  const [isOpen, setOpen] = useState<boolean>(false);

  const open = (id?: string) => {
    if (id) {
      setItemId(id);
    }
    setOpen(true);
  };

  const close = () => {
    setOpen(false);
    setItemId(undefined);
  };

  return { itemId, isOpen, open, close };
};
