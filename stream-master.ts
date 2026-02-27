import { Context } from "@netlify/functions";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret_key_for_dev";
const VIDEO_SOURCE = process.env.VIDEO_SOURCE;

const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
};

export default async (req: Request, context: Context) => {
    // Handle preflight requests
    if (req.method === "OPTIONS") {
        return new Response(null, { status: 204, headers: corsHeaders });
    }

    if (!VIDEO_SOURCE) {
        return new Response("Missing VIDEO_SOURCE environment variable", { status: 500, headers: corsHeaders });
    }

    // Extract token from URL /api/stream/:token/master.m3u8
    const urlParts = new URL(req.url).pathname.split("/");
    // /api/stream/TOKEN/master.m3u8 => [ "", "api", "stream", "TOKEN", "master.m3u8" ]
    const token = urlParts[3];

    if (!token) {
        return new Response("Missing token", { status: 401, headers: corsHeaders });
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
        console.log(`Fetching from VIDEO_SOURCE: ${VIDEO_SOURCE}`);
        // Aggressive CDN Spoofing
        const targetHeaders = new Headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "application/x-mpegURL, application/vnd.apple.mpegurl, audio/mpegurl, video/MP2T, */*",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "Connection": "keep-alive",
            "Origin": "https://tigre-angola.netlify.app",
            "Referer": "https://tigre-angola.netlify.app/",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "cross-site"
        });

        const response = await fetch(VIDEO_SOURCE, {
            headers: targetHeaders,
            method: "GET"
        });

        if (!response.ok) {
            console.error(`Fetch failed. HTTP: ${response.status} ${response.statusText}`);
            console.error("Original URL: ", VIDEO_SOURCE);
            return new Response(`Failed to fetch source from original server: ${response.status} ${response.statusText}`, { status: 502, headers: corsHeaders });
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
                ...corsHeaders,
                "Content-Type": "application/vnd.apple.mpegurl",
                "Cache-Control": "no-store",
            }
        });

    } catch (error: any) {
        console.error("Master proxy error:", error);
        return new Response(`Unauthorized or processing error: ${error.message}`, { status: 401, headers: corsHeaders });
    }
};
