"use client";

import { ReactNode } from "react";
import { Provider } from "react-redux";
import { store } from "@/app/store/index";

export default function ClientRootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return <Provider store={store}>{children}</Provider>;
}
