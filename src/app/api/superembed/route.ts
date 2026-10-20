import { currentViewer } from "@/lib/auth-server";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  if (!await currentViewer()) return NextResponse.json({ error: "Sign in to continue." }, { status: 401, headers: { "Cache-Control": "private, no-store" } });
  const id = req.nextUrl.searchParams.get("id");
  const json = req.nextUrl.searchParams.get("format") === "json";
  const headers = { "Cache-Control": "no-store" };
  if (!id || !/^[1-9]\d{0,9}$/.test(id)) {
    return NextResponse.json({ error: "A valid TMDB movie ID is required." }, { status: 400, headers });
  }
  const url = new URL("https://getsuperembed.link/");
  url.search = new URLSearchParams({
    video_id: id, tmdb: "1", player_font: "Poppins",
    player_bg_color: "000000", player_font_color: "ffffff",
    player_primary_color: "8fba96", player_secondary_color: "394d3e",
    player_loader: "1", preferred_server: "0", player_sources_toggle_type: "2",
  }).toString();
  try {
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(12000) });
    if (!response.ok) throw new Error("Provider unavailable");
    const playerUrl = new URL((await response.text()).trim());
    // Accept only the provider's player domain, never arbitrary redirects or HTML.
    if (playerUrl.protocol !== "https:" || playerUrl.hostname !== "streamingnow.mov" ||
        playerUrl.username || playerUrl.password || playerUrl.port) {
      throw new Error("Invalid player URL");
    }
    return json
      ? NextResponse.json({ url: playerUrl.href, provider: "SuperEmbed" }, { headers })
      : NextResponse.redirect(playerUrl, { status: 307, headers });
  } catch {
    return NextResponse.json(
      { error: "This stream is unavailable right now. Retry or choose another server." },
      { status: 502, headers },
    );
  }
}
