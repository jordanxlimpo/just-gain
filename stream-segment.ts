import { Context } from "@netlify/functions";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret_key_for_dev";

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

    // Extract token and encodeTarget from URL
    const urlParts = new URL(req.url).pathname.split("/");
    const token = urlParts[3];
    const encodedTarget = urlParts.slice(5).join("/");

    if (!token || !encodedTarget) {
        return new Response("Missing parameters", { status: 400, headers: corsHeaders });
    }

    try {
        const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || "unknown";
        const userAgent = req.headers.get("user-agent") || "unknown";

        // Verify token (If it expired, this throws and returns 401)
        const decoded = jwt.verify(token, SECRET_KEY) as any;

        if (decoded.ip !== ip || decoded.userAgent !== userAgent) {
            console.warn("IP or User-Agent mismatch in segment proxy");
        }

        const targetUrl = decodeURIComponent(encodedTarget);

        // Se o URL que chegou acidentalmente não for absoluto (ex: segment_0.ts sozinho),
        // ele vai falhar no fetch(). Para evitar crash absoluto na AWS:
        if (!targetUrl.startsWith('http')) {
            console.error(`Recebeu URL relativo bloqueado: ${targetUrl}`);
            return new Response(`Invalid target URL: ${targetUrl}`, { status: 400, headers: corsHeaders });
        }

        console.log(`[SEGMENT PROXY] Fetching from: ${targetUrl}`);

        const targetHeaders = new Headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
            "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8",
            "Accept-Language": "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7",
            "Connection": "keep-alive",
            "Origin": "https://tigre-angola.netlify.app",
            "Referer": "https://tigre-angola.netlify.app/"
        });

        const response = await fetch(targetUrl, {
            headers: targetHeaders,
            method: "GET"
        });

        if (!response.ok) {
            console.error(`Segment Fetch failed. HTTP: ${response.status} URL: ${targetUrl}`);
            return new Response(`Failed to fetch segment: ${response.status}`, { status: response.status, headers: corsHeaders });
        }

        // Se o arquivo sendo baixado for uma sub-playlist (qualidades de resolução), 
        // precisamos reescrever os URLs dos .ts que estão dentro dela também!
        if (targetUrl.includes(".m3u8")) {
            let subM3u8 = await response.text();
            const lines = subM3u8.split('\n');

            const rewrittenLines = lines.map(line => {
                line = line.trim();
                if (!line || line.startsWith('#')) return line;

                let absoluteUrl = line;
                if (!line.startsWith('http')) {
                    const baseUrl = new URL(targetUrl);
                    const pathParts = baseUrl.pathname.split('/');
                    pathParts.pop();
                    const basePath = pathParts.join('/');
                    absoluteUrl = `${baseUrl.origin}${basePath}/${line}`;
                }
                const encodedSubTarget = encodeURIComponent(absoluteUrl);
                return `/api/stream/${token}/segment/${encodedSubTarget}`;
            });

            return new Response(rewrittenLines.join('\n'), {
                status: 200,
                headers: {
                    ...corsHeaders,
                    "Content-Type": "application/vnd.apple.mpegurl",
                    "Cache-Control": "no-store",
                }
            });
        }

        // Se for um arquivo de vídeo comum (.ts, .aac, etc), devolve o buffer
        const arrayBuffer = await response.arrayBuffer();

        return new Response(arrayBuffer, {
            status: 200,
            headers: {
                ...corsHeaders,
                "Content-Type": response.headers.get("Content-Type") || "video/MP2T",
                "Cache-Control": "no-store",
            }
        });

    } catch (error: any) {
        console.error("Segment proxy error:", error);
        return new Response(`Unauthorized or processing error: ${error.message}`, { status: 401, headers: corsHeaders });
    }
};
