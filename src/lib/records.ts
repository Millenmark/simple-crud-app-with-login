import type { Record } from "@/components/data-table";

export async function getRecords(): Promise<Record[]> {
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
