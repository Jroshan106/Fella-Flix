import { currentViewer } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";
import { CatalogError, getCatalog, getMovie, getGenres, getSeason, getCatalogProvider } from "@/lib/catalog";

export async function GET(request: NextRequest) {
  if (!await currentViewer()) return NextResponse.json({ error: "Sign in to continue." }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  try {
    const params = request.nextUrl.searchParams;
    const kind = params.get("kind") || "movie";
    if (params.get("view") === "genres") return NextResponse.json({ genres: await getGenres(kind), provider: getCatalogProvider() });
    const id = params.get("id");
    if (params.has("season")) {
      if (kind !== "series" || id === null) throw new CatalogError("A series ID is required.", 400);
      return NextResponse.json({ season: await getSeason(id, params.get("season")!) });
    }
    if (id !== null) return NextResponse.json({ movie: await getMovie(id, kind) });
    if (params.get("view") === "home") {
      const [movies, series] = await Promise.all([
        getCatalog(new URLSearchParams()),
        getCatalog(new URLSearchParams({ kind: "series" })),
      ]);
      return NextResponse.json({ movies: movies.results.slice(0, 10), series: series.results.slice(0, 10) });
    }
    return NextResponse.json(await getCatalog(params));
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof CatalogError ? error.message : "The movie catalog is temporarily unavailable." },
      { status: error instanceof CatalogError ? error.status : 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
