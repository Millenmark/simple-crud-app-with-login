import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type { Record } from "@/components/data-table";

async function getRecords(): Promise<Record[]> {
  try {
    const res = await fetch(
      `${
        process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
      }/api/record`,
      {
        cache: "no-store",
      }
    );
    if (!res.ok) throw new Error("Failed to fetch records");
    return res.json();
  } catch (error) {
    console.error("Error fetching records:", error);
    return [];
  }
}

export default async function Page() {
  const records = await getRecords();

  return (
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
              <DataTable data={records} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
