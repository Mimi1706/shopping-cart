import { useContext, ReactNode, createContext, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import { useLocalStorage } from "../hooks/useLocalStorage";

// ReactNode is the type you give to function children
type ShoppingCartProviderProps = {
  children: ReactNode;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number; // total number of items in cart
  cartItems: CartItem[]; // array of items in cart
};

// id has name and price informations
type CartItem = {
  id: number;
  quantity: number;
};

// context will provide the context values from the Provider
const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

// Provider allows consuming components to subscribe to context changes, all descendant consumers will re-render whenever the provider's value prop changes
export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  // useState will take the types of CartItem[]
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // UseLocalStorage will take the types of CartItem[]
  /*const [cartItems, setCartItems] = useLocalStorage<CartItem[]>(
    "shopping-cart",
    []
  );*/

  const [isOpen, setIsOpen] = useState(false);

  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);

  // counting up all quantities for all items in the cart
  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0 // default start at 0
  );

  const getItemQuantity = (id: number) => {
    // if condition amounts to something, return it, else return 0
    return cartItems.find((item) => item.id === id)?.quantity || 0;
  };

  const increaseCartQuantity = (id: number) => {
    // current items are the items inside the cart
    setCartItems((currItems) => {
      // If we don't have the item, we add it
      if (currItems.find((item) => item.id === id) == null) {
        return [...currItems, { id, quantity: 1 }];
      } else {
        // If we already have the item in the cart, we add one more
        return currItems.map((item) => {
          if (item.id === id) {
            // destructuring to keep the original values inside the cart and add one quantity
            return { ...item, quantity: item.quantity + 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const decreaseCartQuantity = (id: number) => {
    // current items are the items inside the cart
    setCartItems((currItems) => {
      // if the item already exist once in the cart
      if (currItems.find((item) => item.id === id)?.quantity === 1) {
        // return a new array without this item id
        return currItems.filter((item) => item.id !== id);
      } else {
        // If we already have several of the same item id in the cart
        return currItems.map((item) => {
          if (item.id === id) {
            // destructuring to keep the original values inside the cart and take out one quantity
            return { ...item, quantity: item.quantity - 1 };
          } else {
            return item;
          }
        });
      }
    });
  };

  const removeFromCart = (id: number) => {
    setCartItems((currItems) => {
      return currItems.filter((item) => item.id !== id);
    });
  };

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        cartItems,
        openCart,
        closeCart,
        cartQuantity,
      }}
    >
      {children}
      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
