import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const video_id = searchParams.get('id');
  
  if (!video_id) return NextResponse.json({ error: "Missing ID" }, { status: 400 });

  const url = `https://getsuperembed.link/?video_id=${video_id}&tmdb=1&player_font=Poppins&player_bg_color=000000&player_font_color=ffffff&player_primary_color=34cfeb&player_secondary_color=6900e0&player_loader=1&preferred_server=0&player_sources_toggle_type=2`;
  
  try {
    const response = await fetch(url);
    const player_url = await response.text();
    
    if (player_url && player_url.includes("https://")) {
      return NextResponse.redirect(player_url);
    } else {
      return new NextResponse(`<span style='color:red'>${player_url}</span>`, { status: 400, headers: { 'Content-Type': 'text/html' }});
    }
  } catch (err) {
    return new NextResponse("Request server didn't respond", { status: 500 });
  }
}
