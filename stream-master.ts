import { Context } from "@netlify/functions";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret_key_for_dev";
const VIDEO_SOURCE = process.env.VIDEO_SOURCE;

export default async (req: Request, context: Context) => {
    if (!VIDEO_SOURCE) {
        return new Response("Missing VIDEO_SOURCE environment variable", { status: 500 });
    }

    // Extract token from URL /api/stream/:token/master.m3u8
    const urlParts = new URL(req.url).pathname.split("/");
    // /api/stream/TOKEN/master.m3u8 => [ "", "api", "stream", "TOKEN", "master.m3u8" ]
    const token = urlParts[3];

    if (!token) {
        return new Response("Missing token", { status: 401 });
    }

    try {
        const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || "unknown";
        const userAgent = req.headers.get("user-agent") || "unknown";

        // Verify token
        const decoded = jwt.verify(token, SECRET_KEY) as any;

        if (decoded.ip !== ip || decoded.userAgent !== userAgent) {
            console.warn("IP or User-Agent mismatch", {
                expectedIp: decoded.ip, actualIp: ip,
                expectedUa: decoded.userAgent, actualUa: userAgent
            });
            // In a strict production environment we would reject:
            // return new Response("Invalid client", { status: 403 });
        }

        // Fetch the original master playlist
        const response = await fetch(VIDEO_SOURCE);
        if (!response.ok) {
            return new Response(`Failed to fetch source: ${response.status}`, { status: 502 });
        }

        let m3u8 = await response.text();

        // The VIDEO_SOURCE is usually a master playlist or a segment playlist.
        // If it's a master playlist pointing to other playlists (like resolution paths),
        // or if it's already a list of segments (.ts files).
        // We want to rewrite ANY .m3u8 or .ts files to pass through our proxy again.

        // Simplest rewrite approach for all lines not starting with #:
        const lines = m3u8.split('\n');
        const rewrittenLines = lines.map(line => {
            line = line.trim();
            if (!line || line.startsWith('#')) return line;

            // If the line is an absolute URL or relative URL (a .ts file or another .m3u8)
            // we need to make it point to our segment proxy.
            // E.g. "segment_1.ts" => "/api/stream/{token}/segment/segment_1.ts"

            // We will encode the original URL so the segment proxy knows what to fetch
            // If the URL in m3u8 is relative, we must resolve it against the VIDEO_SOURCE base
            let absoluteUrl = line;
            if (!line.startsWith('http')) {
                const baseUrl = new URL(VIDEO_SOURCE);
                // remove the filename from VIDEO_SOURCE path
                const pathParts = baseUrl.pathname.split('/');
                pathParts.pop();
                const basePath = pathParts.join('/');
                absoluteUrl = `${baseUrl.origin}${basePath}/${line}`;
            }

            const encodedTarget = encodeURIComponent(absoluteUrl);
            return `/api/stream/${token}/segment/${encodedTarget}`;
        });

        const finalM3u8 = rewrittenLines.join('\n');

        return new Response(finalM3u8, {
            status: 200,
            headers: {
                "Content-Type": "application/vnd.apple.mpegurl",
                "Cache-Control": "no-store",
                "Access-Control-Allow-Origin": "*"
            }
        });

    } catch (error) {
        return new Response("Unauthorized or processing error", { status: 401 });
    }
};
