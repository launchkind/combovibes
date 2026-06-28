import { combineReducers, configureStore } from "@reduxjs/toolkit";
import productsReducer from "./features/products/productsSlice";
import cartsReducer from "./features/carts/cartsSlice";

const rootReducer = combineReducers({
  products: productsReducer,
  carts: cartsReducer,
});

export const makeStore = () => {
  const store = configureStore({
    reducer: rootReducer,
    devTools: process.env.NODE_ENV !== "production",
  });
  return { store };
};

const store = makeStore().store;

export type AppStore = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export { store };
