"use client";

import { AuthProvider } from "@/hooks/UseAuth";
import WorkerLayoutInner from "./workerLayoutInner";

export default function WorkerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <WorkerLayoutInner>{children}</WorkerLayoutInner>
        </AuthProvider>
      </body>
    </html>
  );
}
