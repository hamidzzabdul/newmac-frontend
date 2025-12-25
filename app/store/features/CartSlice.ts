import {createSlice, PayloadAction} from "@reduxjs/toolkit"
import { CartItem } from "@/app/tyoes/cart"


type CartState = {
    items: CartItem[]
}

const initialState: CartState = {
    items: []
}

export const cartSlice = createSlice({
    name: "cart",
    initialState,
    reducers: {
        addToCart: (state, actions: PayloadAction<CartItem>) => {
            const existing = state.items.find(item => item.id === actions.payload.id)

            if(existing){
                existing.quantityKg += actions.payload.quantityKg
            }else{
                state.items.push(actions.payload)
            }
        },
        removeFromCart: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter(item => item.id !== action.payload);
          },
      
          updateQuantity: (
            state,
            action: PayloadAction<{ id: string; quantity: number }>
          ) => {
            const item = state.items.find(i => i.id === action.payload.id);
            if (item) {
              item.quantityKg = action.payload.quantity;
            }
          },
      
          clearCart: state => {
            state.items = [];
          },

    }
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions;

export default cartSlice.reducer;