"use client";

import { useState, useEffect } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { DataTable } from "@/components/data-table";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Record } from "@/components/data-table";
import { Toaster } from "@/components/ui/sonner";
import { getRecords } from "@/lib/records";

export default function Page() {
  const [records, setRecords] = useState<Record[]>([]);

  const fetchRecords = async () => {
    const data = await getRecords();
    setRecords(data);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  return (
    <>
      <SidebarProvider
        style={
          {
            "--sidebar-width": "calc(var(--spacing) * 72)",
            "--header-height": "calc(var(--spacing) * 12)",
          } as React.CSSProperties
        }
      >
        <AppSidebar variant="inset" />
        <SidebarInset>
          <SiteHeader />
          <div className="flex flex-1 flex-col">
            <div className="@container/main flex flex-1 flex-col gap-2">
              <div className="flex flex-col gap-4 px-5 py-4 md:gap-6 md:py-6">
                <DataTable data={records} onRefetch={fetchRecords} />
              </div>
            </div>
          </div>
        </SidebarInset>
      </SidebarProvider>
      <Toaster position="top-center" />
    </>
  );
}
