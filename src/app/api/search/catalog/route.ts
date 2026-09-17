import { NextResponse } from "next/server";
import { getSearchCatalogLightweight } from "@/lib/search/minisearch-provider";

export async function GET() {
	const items = await getSearchCatalogLightweight();
	return NextResponse.json(items, {
		headers: {
			"Cache-Control": "public, max-age=3600, stale-while-revalidate=86400",
		},
	});
}
