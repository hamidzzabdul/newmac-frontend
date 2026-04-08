import { configureStore } from "@reduxjs/toolkit";
import cartReducer from "@/app/store/features/CartSlice";
import { loadCart, saveCart } from "./LocalStorage";

const preloadedState = {
  cart: loadCart() ?? { items: [] },
};

export const store = configureStore({
  reducer: {
    cart: cartReducer,
  },
  preloadedState,
});

if (typeof window !== "undefined") {
  store.subscribe(() => {
    saveCart(store.getState().cart);
  });
}

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
