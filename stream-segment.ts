import { Context } from "@netlify/functions";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret_key_for_dev";

export default async (req: Request, context: Context) => {
    // Extract token and encodeTarget from URL
    // /api/stream/:token/segment/:encodedTarget
    const urlParts = new URL(req.url).pathname.split("/");
    const token = urlParts[3];

    // The rest of the URL is the encoded target, which might contain slashes if not properly delimited
    // Alternatively, just grab the last part. Since we used encodeURIComponent, it should be safe in index 5
    // Note: /api/stream/TOKEN/segment/SOMETHING => index 0="", 1="api", 2="stream", 3=TOKEN, 4="segment", 5=SOMETHING
    const encodedTarget = urlParts.slice(5).join("/");

    if (!token || !encodedTarget) {
        return new Response("Missing parameters", { status: 400 });
    }

    try {
        const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || "unknown";
        const userAgent = req.headers.get("user-agent") || "unknown";

        // Verify token
        const decoded = jwt.verify(token, SECRET_KEY) as any;

        if (decoded.ip !== ip || decoded.userAgent !== userAgent) {
            console.warn("IP or User-Agent mismatch in segment proxy");
            // Strict environment: 
            // return new Response("Invalid client", { status: 403 });
        }

        // Rate Limiting could be implemented here with an external store (Upstash Redis, etc).
        // Netlify Functions don't share memory well, so an external DB is required for true rate limiting.
        // For now, token expiration restricts the window of usage.

        // Proxy the video segment
        const targetUrl = decodeURIComponent(encodedTarget);

        const response = await fetch(targetUrl);
        if (!response.ok) {
            return new Response(`Failed to fetch segment: ${response.status}`, { status: 502 });
        }

        // Return the binary data (Buffer/ArrayBuffer)
        const arrayBuffer = await response.arrayBuffer();

        return new Response(arrayBuffer, {
            status: 200,
            headers: {
                "Content-Type": response.headers.get("Content-Type") || "video/MP2T", // typical for .ts
                "Cache-Control": "no-store",       // anti-hotlink
                "Access-Control-Allow-Origin": "*" // CORS for hls.js
            }
        });

    } catch (error) {
        return new Response("Unauthorized or processing error", { status: 401 });
    }
};
