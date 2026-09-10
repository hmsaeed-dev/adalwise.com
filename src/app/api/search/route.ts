import { NextResponse } from "next/server";
import { searchService } from "@/lib/search/service";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const type = (searchParams.get("type") as any) || "all";

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  const results = await searchService.search(q, { type, limit: 8 });
  return NextResponse.json(results);
}
