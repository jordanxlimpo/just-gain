import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Hls from "hls.js";
import GoldButton from "@/components/GoldButton";

const NAMES = [
    "Marcos Andrade", "Paulo Freitas", "Ana Silva", "Carlos Gomes",
    "Luísa Santos", "Ricardo Lopes", "Fernanda Costa", "João Oliveira",
    "Beatriz Lima", "Gabriel Souza", "Juliana Pereira", "Tiago Martins"
];

const AMOUNTS = [
    "115.000", "99.000", "121.000", "85.000", "150.000", "78.000"
];

const FinalStep = () => {
    const [showButton, setShowButton] = useState(false);
    const [notifications, setNotifications] = useState<{ id: number, text: string }[]>([]);
    const [videoSrc, setVideoSrc] = useState<string | null>(null);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const videoRef = useRef<HTMLVideoElement>(null);

    useEffect(() => {
        // Fetch the secure video token
        const fetchVideoToken = async () => {
            try {
                console.log("Iniciando requisição para /api/video-token...");
                const response = await fetch("/api/video-token");
                console.log("Status da resposta HTTP:", response.status);

                if (response.ok) {
                    const data = await response.json();
                    console.log("Token recebido com sucesso:", data);
                    if (data.token) {
                        setVideoSrc(`/api/stream/${data.token}/master.m3u8`);
                    } else {
                        setErrorMsg("Token veio vazio da API.");
                    }
                } else {
                    const errText = await response.text();
                    setErrorMsg(`Erro na API (${response.status}): ${errText || 'Servidor não encontrou a rota /api/video-token. Tem certeza que rodou com `netlify dev` e não apenas `npm run dev`?'}`);
                }
            } catch (error: any) {
                console.error("Falha ao carregar o token de vídeo seguro", error);
                setErrorMsg(`Erro de rede ao conectar na API: ${error.message}`);
            }
        };
        fetchVideoToken();

        // Button Delay: 1 min 5 seconds (65000ms)
        const timer = setTimeout(() => {
            setShowButton(true);
        }, 65000);

        // Initial notifications
        addNotification("Marcos Andrade sacou 115.000 Kzs");
        setTimeout(() => addNotification("Paulo Freitas ganhou 99.000 Kzs"), 3000);

        // Random notifications interval
        const interval = setInterval(() => {
            const name = NAMES[Math.floor(Math.random() * NAMES.length)];
            const amount = AMOUNTS[Math.floor(Math.random() * AMOUNTS.length)];
            const action = Math.random() > 0.5 ? "sacou" : "ganhou";
            addNotification(`${name} ${action} ${amount} Kzs`);
        }, 5000);

        // Security: Pause on blur / switch tabs for more than 60 seconds
        let blurTimeout: NodeJS.Timeout;
        const handleVisibilityChange = () => {
            if (document.hidden) {
                if (videoRef.current) videoRef.current.pause();
                // Automatically invalidate token / pause if hidden for 60 seconds
                blurTimeout = setTimeout(() => {
                    setVideoSrc(null); // Invalidate state
                }, 60000);
            } else {
                clearTimeout(blurTimeout);
            }
        };

        // Security: Primitive DevTools detection
        const detectDevTools = () => {
            const threshold = 160;
            if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
                if (videoRef.current) videoRef.current.pause();
            }
        };

        document.addEventListener("visibilitychange", handleVisibilityChange);
        window.addEventListener("resize", detectDevTools);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
            window.removeEventListener("resize", detectDevTools);
            clearTimeout(blurTimeout);
        };
    }, []);

    // Initialize HLS
    useEffect(() => {
        let hls: Hls;

        if (videoSrc && videoRef.current && !errorMsg) {
            console.log("Iniciando hls.js com a URL:", videoSrc);
            if (Hls.isSupported()) {
                hls = new Hls({
                    debug: true, // Ativado debug temporariamente para ver os logs do player
                });

                hls.on(Hls.Events.ERROR, (event, data) => {
                    console.error("HLS.js Error:", data);
                    if (data.fatal) {
                        setErrorMsg(`Erro fatal no HLS: ${data.type} - ${data.details}`);
                    }
                });

                hls.loadSource(videoSrc);
                hls.attachMedia(videoRef.current);
                hls.on(Hls.Events.MANIFEST_PARSED, () => {
                    console.log("Manifesto lido com sucesso! Tentando dar play...");
                    videoRef.current?.play().catch((err) => {
                        console.warn("Autoplay bloqueado pelo navegador", err);
                    });
                });
            } else if (videoRef.current.canPlayType('application/vnd.apple.mpegurl')) {
                // For Safari
                videoRef.current.src = videoSrc;
                videoRef.current.addEventListener('loadedmetadata', () => {
                    videoRef.current?.play().catch(() => { });
                });
            }
        }

        return () => {
            if (hls) {
                hls.destroy();
            }
        };
    }, [videoSrc, errorMsg]);

    const addNotification = (text: string) => {
        const id = Date.now();
        setNotifications((prev) => [...prev, { id, text }].slice(-3));
        setTimeout(() => {
            setNotifications((prev) => prev.filter((n) => n.id !== id));
        }, 4000);
    };

    const handleAction = () => {
        window.location.href = "https://pay.clickpayon.com/c5e97e36-af5d-4a45-a766-b49e10d51a50";
    };

    return (
        <div className="min-h-screen bg-black flex flex-col items-center pt-10 px-4 relative overflow-hidden">
            <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto pb-20 relative z-10">
                <div className="text-center">
                    <h1 className="text-2xl font-black text-white px-2 leading-tight uppercase tracking-tight">
                        ASSISTA O VÍDEO ABAIXO PARA VER COMO <span className="text-gold">RECEBER O SEU DINHEIRO</span> AGORA MESMO
                    </h1>
                </div>

                {/* Secure Video Player container */}
                <div className="relative w-full aspect-video bg-zinc-900 rounded-lg overflow-hidden border border-zinc-800 shadow-2xl">
                    {errorMsg ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-red-900/20 p-6 text-center">
                            <h3 className="text-red-500 font-bold mb-2">Erro de Reprodução</h3>
                            <p className="text-red-300 text-sm whitespace-pre-wrap">{errorMsg}</p>
                        </div>
                    ) : videoSrc ? (
                        <video
                            ref={videoRef}
                            className="w-full h-full object-cover"
                            controls
                            controlsList="nodownload"
                            onContextMenu={(e) => e.preventDefault()}
                            playsInline
                        />
                    ) : (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4">
                            <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
                            <span className="text-gold text-xs font-bold uppercase tracking-widest">Carregando Player Seguro...</span>
                        </div>
                    )}
                </div>

                {/* Delayed Button */}
                <div className="px-2" style={{ minHeight: "70px" }}>
                    <AnimatePresence>
                        {showButton && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                                animate={{ opacity: 1, scale: 1, y: 0 }}
                                transition={{ type: "spring", damping: 15 }}
                            >
                                <GoldButton onClick={handleAction}>
                                    DESBLOQUEAR O SAQUE
                                </GoldButton>
                            </motion.div>
                        )}
                    </AnimatePresence>
                    {!showButton && (
                        <p className="text-xs text-white/30 text-center font-bold uppercase tracking-[0.2em] animate-pulse">
                            Aguarde o vídeo carregar...
                        </p>
                    )}
                </div>

                {/* Floating Notifications */}
                <div className="fixed bottom-10 left-4 right-4 z-[100] pointer-events-none flex flex-col gap-2">
                    <AnimatePresence>
                        {notifications.map((n) => (
                            <motion.div
                                key={n.id}
                                initial={{ opacity: 0, x: -50 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 50 }}
                                className="bg-black/90 backdrop-blur-xl border border-gold/30 rounded-2xl px-6 py-4 flex items-center gap-4 shadow-[0_10px_30px_rgba(0,0,0,0.5)] self-start max-w-[95%]"
                            >
                                <div className="w-10 h-10 rounded-full bg-gold/20 flex items-center justify-center text-xl shadow-inner border border-gold/30">
                                    🐅
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-sm font-black text-white">
                                        {n.text}
                                    </span>
                                    <span className="text-[10px] text-green-400 font-bold tracking-widest uppercase flex items-center gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Transação Live
                                    </span>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            </div>
        </div>
    );
};

export default FinalStep;

