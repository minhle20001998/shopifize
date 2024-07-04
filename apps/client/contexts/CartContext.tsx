import { CartItem } from "@shopifize/helpers";
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from "react";
import { useDeepCompareMemo } from "use-deep-compare";

interface CartContextType {
  calculateTotal: number;
  selectedCartItems: CartItem[];
  setSelectedCartItems: Dispatch<SetStateAction<CartItem[]>>;
}

const CartContext = createContext<CartContextType>({
  calculateTotal: 0,
  selectedCartItems: [],
  setSelectedCartItems: () => {},
});

function CartProvider({ children }: { children: React.ReactNode }) {
  const [selectedCartItems, setSelectedCartItems] = useState<CartItem[]>([]);

  const calculateTotal = selectedCartItems.reduce((prev, current) => {
    return prev + current.product_variant.price * current.quantity;
  }, 0);

  const value = useDeepCompareMemo(() => {
    return {
      calculateTotal,
      selectedCartItems,
      setSelectedCartItems,
    };
  }, [selectedCartItems, calculateTotal]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export const useCartContext = () => {
  return useContext(CartContext);
};

export default CartProvider;
