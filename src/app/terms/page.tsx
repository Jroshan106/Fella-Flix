import type { Metadata } from "next";
import Link from "next/link";
import LegalPage, { LegalContact } from "../components/LegalPage";

export const metadata: Metadata = { title: "Terms of Service | FellaFLIX", description: "Terms for using FellaFLIX and its third-party movie and series players." };

export default function TermsPage() {
  return <LegalPage title="Terms of Service" description="These terms explain the conditions for using the FellaFLIX website.">
    <section><h2>Using the service</h2><p>By using FellaFLIX, you agree to these terms. If you do not agree, stop using the website. Use the service only as permitted by the laws that apply to you and only access content you are legally entitled to view. Access to a title does not grant permission from its copyright owner.</p></section>
    <section><h2>Movies, series, and external players</h2><p>FellaFLIX displays movie and series information from TMDB and embeds players operated by third parties. Video files are delivered by those providers, rather than stored on this website. TMDB supplies metadata, not video streams, and does not endorse or certify FellaFLIX.</p><p>External providers control their streams, advertisements, subtitles, and playback features. Their own terms and privacy policies apply when you use their services. A listing does not guarantee that a stream is available, accurate, licensed in your region, or free of advertisements.</p></section>
    <section><h2>Acceptable use</h2><ul><li>Do not use the website to infringe intellectual-property rights or break applicable law.</li><li>Do not disrupt the website, attempt unauthorized admin access, introduce malicious code, or bypass its security controls.</li><li>Do not submit unlawful, abusive, or sensitive personal information through the title-request form.</li></ul></section>
    <section><h2>Requests and availability</h2><p>Submitting a title request does not guarantee that the title will be added or that playback will become available. Information, providers, and website features may change or be removed. We may restrict abusive use or remove disputed links.</p></section>
    <section><h2>Service limitations</h2><p>The website is provided as available. We do not promise uninterrupted access, error-free metadata, or the reliability or safety of third-party services. Nothing in these terms excludes rights or remedies that applicable law does not allow to be excluded.</p></section>
    <section><h2>Privacy and copyright</h2><p>Read our <Link href="/privacy" className="underline">Privacy Policy</Link> for information about data and external services. Copyright owners can use the procedure on our <Link href="/dmca" className="underline">DMCA page</Link> to report specific links.</p></section>
    <section><h2>Changes and contact</h2><p>We may revise these terms by updating this page and its date. Questions about the website or these terms can be sent to <LegalContact subject="FellaFLIX terms inquiry" />.</p></section>
  </LegalPage>;
}
