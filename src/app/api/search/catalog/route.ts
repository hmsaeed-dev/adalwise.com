import { NextResponse } from "next/server";
import { getSearchCatalogLightweight } from "@/lib/search/minisearch-provider";

export const dynamic = "force-static";
export const revalidate = 86400;

export async function GET() {
	const items = await getSearchCatalogLightweight();
	return NextResponse.json(items, {
		headers: {
			"Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
		},
	});
}
