import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import { useDeepCompareMemo } from "use-deep-compare";

interface ProductContextType {
  deleteVariantIds: string[]
  editVariantIds: string[]
  addVariantIds: unknown[]
  setEditVariantIds: Dispatch<SetStateAction<string[]>>
  setDeleteVariantIds: Dispatch<SetStateAction<string[]>>
  setAddVariantIds: Dispatch<SetStateAction<unknown[]>>
}

const ProductContext = createContext<ProductContextType>({
  deleteVariantIds: [],
  editVariantIds: [],
  addVariantIds: [],
  setDeleteVariantIds: () => { },
  setEditVariantIds: () => { },
  setAddVariantIds: () => { }
});

function ProductProvider({
  children,
  deleteVariantIds: deleteVariantIdsProps,
  editVariantIds: editVariantIdsProps,
  addVariantIds: addVariantIdsProps,
  setEditVariantIds: setEditVariantIdsProps,
  setDeleteVariantIds: setDeleteVariantIdsProps,
  setAddVariantIds: setAddVariantIdsProps
}: {
  children: React.ReactNode,
} & Partial<ProductContextType>
) {

  const [addVariantIds, setAddVariantIds] = useState<unknown[]>([])
  const [editVariantIds, setEditVariantIds] = useState<string[]>([])
  const [deleteVariantIds, setDeleteVariantIds] = useState<string[]>([])

  const value = useDeepCompareMemo(() => {
    return {
      addVariantIds: addVariantIdsProps ? addVariantIdsProps : addVariantIds,
      editVariantIds: editVariantIdsProps ? editVariantIdsProps : editVariantIds,
      deleteVariantIds: deleteVariantIdsProps ? deleteVariantIdsProps : deleteVariantIds,
      setDeleteVariantIds: setDeleteVariantIdsProps ? setDeleteVariantIdsProps : setDeleteVariantIds,
      setEditVariantIds: setEditVariantIdsProps ? setEditVariantIdsProps : setEditVariantIds,
      setAddVariantIds: setAddVariantIdsProps ? setAddVariantIdsProps : setAddVariantIds
    }
  }, [
    addVariantIdsProps,
    editVariantIdsProps,
    deleteVariantIdsProps,
    addVariantIds,
    editVariantIds,
    deleteVariantIds
  ])

  return (
    <ProductContext.Provider
      value={value}
    >
      {children}
    </ProductContext.Provider>
  );
}

export const useProductContext = () => {
  return useContext(ProductContext);
};


export default ProductProvider
