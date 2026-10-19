# Streaming provider review — 19 October 2026

These are eight server options across seven providers, not six verified ad-free video sources. No provider was verified through a complete movie. Provider marketing was checked against real browser observations on `/watch/550`.

| Provider | Primary documentation | Observed result |
| --- | --- | --- |
| Movies Nexus | https://www.moviesnexus.fun/ | HTTP 200; browser player remained on a loading spinner. Playback not confirmed. |
| Nexus Multi-audio | https://www.moviesnexus.fun/ | Documented `sv=multi-audio` source selection, separate from automatic server selection. Playback not confirmed. |
| YapGrid | https://github.com/enikqi/yapgrid | Advertises ad-free access, but browser inspection exposed an advertising link. Retained only as a protected fallback; not labeled ad-free. |
| VidCore | https://vidcore.org/ | Advertises ad-free access; browser loaded a nested player with an advertising link. Retained only as a protected fallback. This is `.org`, not the former `.io` provider. |
| VidPhantom | https://vidphantom.com/ | Controls loaded; an advertising link was observed despite ad-free marketing. Retained only as a protected fallback. |

Rejected: FilmU and Stellar explicitly refused sandboxed playback in the browser; ezvidapi returned HTTP 502. SuperEmbed was removed from the watch-page selector after the user's excessive-ad report. Its legacy API remains available for backwards compatibility.

## Protection and limitations

- Every selected iframe uses `allow-scripts allow-same-origin allow-presentation`. Popup, top-navigation, form and download permissions are omitted. Cross-origin frames cannot remove their own parent sandbox attribute.
- The sandbox blocks new windows and navigation of the outer page. It cannot remove advertisements or prevent navigation within the frame. No claim is made that all advertising is blocked.
- The app never automatically falls back to an unsandboxed player. If a provider refuses protection or stalls, viewers can switch using the persistent toolbar.
- An iframe `load` event only indicates frame loading; it is not proof of playable video. Cross-origin playback failures cannot reliably be detected without a provider event contract.
- FellaFLIX supplies the server selector, reload, next-server and fullscreen toolbar. Playback controls and media remain provider-owned. A truly native player requires direct, browser-accessible media URLs and a supported stream API.
- Stable provider IDs use a new preference key; the old numeric SuperEmbed selection is ignored. Invalid IDs do not produce an iframe URL.

Run `node test-players.cjs` for configuration and protection checks. Live ad behavior and title availability must be rechecked periodically; provider claims are not guarantees.

## Server list update

PeeStream was removed at the user's request. YapGrid is first and is the default for new visitors and saved PeeStream selections. Other valid saved choices remain selected. Three providers were appended:

| Provider | Documentation | Verification |
| --- | --- | --- |
| VidLink | https://vidlink.pro/ | Documented TMDB movie embed and color parameters; full playback and ad behavior not verified. |
| VidFast | https://vidfast.vc/ | Documented movie embed and theme parameters; full playback and ad behavior not verified. |
| Videasy | https://videasy.ws/docs.html | Documented movie iframe endpoint; full playback and ad behavior not verified. |

All three retain the same iframe sandbox. They are alternatives, not certified ad-free sources; compatibility with the protected frame is not guaranteed.
