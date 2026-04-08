// app/orders/success/page.tsx
import { Suspense } from "react";
import OrderSuccessPage from "./orderSuccesPage"; // move the component to a separate file

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          Loading...
        </div>
      }
    >
      <OrderSuccessPage />
    </Suspense>
  );
}
