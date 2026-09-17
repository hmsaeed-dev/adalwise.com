import { NextResponse } from "next/server";
import { searchService } from "@/lib/search/service";
import { SearchOptions } from "@/lib/search/types";

const VALID_SEARCH_TYPES: ReadonlyArray<NonNullable<SearchOptions["type"]>> = [
  "article",
  "lectures",
  "dispatch",
  "majlis",
  "note",
  "all",
];

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") || "";
  const rawType = searchParams.get("type");
  const type: SearchOptions["type"] = VALID_SEARCH_TYPES.includes(
    rawType as NonNullable<SearchOptions["type"]>
  )
    ? (rawType as SearchOptions["type"])
    : "all";

  if (!q.trim()) {
    return NextResponse.json([]);
  }

  const results = await searchService.search(q, { type, limit: 8 });
  return NextResponse.json(results);
}
