"use client";

import { SessionProvider } from "next-auth/react";
import DashboardLayout from "@/components/dashboard/dashboard-layout";

export default function DashboardRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <DashboardLayout>{children}</DashboardLayout>
    </SessionProvider>
  );
}
