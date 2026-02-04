"use client";
import CartLayout from "./CartLayout";
import EmptyCart from "./EmptyCart";
import { useAppSelector } from "../../store/hook";
// Cart Page Component with Flex Design
const Cart = () => {
  const cartItems = useAppSelector((state) => state.cart.items);
  return (
    <div className="">
      {cartItems.length === 0 ? <EmptyCart /> : <CartLayout />}
    </div>
  );
};

export default Cart;
