import CartLayout from "./CartLayout";
import EmptyCart from "./EmptyCart";
// Cart Page Component with Flex Design
const Cart = () => {
  const isEmpty = false;
  return <div className="">{isEmpty ? <EmptyCart /> : <CartLayout />}</div>;
};

export default Cart;
