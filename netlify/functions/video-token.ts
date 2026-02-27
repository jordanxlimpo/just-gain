import { Context } from "@netlify/functions";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.SECRET_KEY || "fallback_secret_key_for_dev";

export default async (req: Request, context: Context) => {
    // Configuração rápida de CORS, ajustável conforme necessidade
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Content-Type": "application/json",
    };

    try {
        const ip = req.headers.get("x-nf-client-connection-ip") || req.headers.get("x-forwarded-for") || "unknown";
        const userAgent = req.headers.get("user-agent") || "unknown";

        // O token expira em 5 minutos
        const expiresIn = 300;

        const token = jwt.sign(
            {
                ip,
                userAgent,
                nonce: Math.random().toString(36).substring(2, 15),
            },
            SECRET_KEY,
            { expiresIn }
        );

        return new Response(JSON.stringify({ token, expiresIn }), {
            status: 200,
            headers
        });
    } catch (error) {
        console.error("Token generation error:", error);
        return new Response(JSON.stringify({ error: "Internal Server Error" }), {
            status: 500,
            headers
        });
    }
};
