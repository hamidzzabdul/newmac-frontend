"use client";

import { AuthProvider } from "@/hooks/UseAuth";
import AdminLayoutInner from "./AdminLayoutInner";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AdminLayoutInner>{children}</AdminLayoutInner>
        </AuthProvider>
      </body>
    </html>
  );
}
