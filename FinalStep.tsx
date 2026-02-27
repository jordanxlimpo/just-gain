import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
    const [tokenValid, setTokenValid] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    useEffect(() => {
        // Fetch the secure video token from our Netlify Function barrier
        const fetchVideoToken = async () => {
            try {
                console.log("Iniciando requisição de segurança...");
                const response = await fetch("/api/video-token");

                if (response.ok) {
                    const data = await response.json();
                    if (data.token) {
                        setTokenValid(true);
                        console.log("Token Valido. Liberando player Nativo.");
                    } else {
                        setErrorMsg("Token de bloqueio vazio.");
                    }
                } else {
                    setErrorMsg("Acesso Negado ou Servidor Ocupado.");
                }
            } catch (error: any) {
                console.error("Falha ao carregar o token de segurança", error);
                setErrorMsg(`Erro de rede ao conectar no bloqueio.`);
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

        // Security: Remove player if hidden for more than 60 seconds
        let blurTimeout: NodeJS.Timeout;
        const handleVisibilityChange = () => {
            if (document.hidden) {
                // Automatically invalidate token / remove player if hidden for 60 seconds
                blurTimeout = setTimeout(() => {
                    setTokenValid(false);
                    setErrorMsg("Sessão expirada por inatividade. Recarregue a página.");
                }, 60000);
            } else {
                clearTimeout(blurTimeout);
            }
        };

        // Security: Primitive DevTools detection unmounts iframe
        const detectDevTools = () => {
            const threshold = 160;
            if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
                setTokenValid(false);
                setErrorMsg("Acesso Interrompido.");
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
                    ) : tokenValid ? (
                        <div style={{ position: 'relative', width: '100%', height: '100%', overflow: 'hidden' }}>
                            <iframe
                                src="https://scripts.converteai.net/51dde582-0ca5-4e62-a622-49f59f40a968/players/699ce4d27d7b375b25f4059b/embed.html"
                                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%' }}
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                allowFullScreen
                            ></iframe>
                        </div>
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

