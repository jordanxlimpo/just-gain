import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import CardShell from "@/components/CardShell";
import tigerHeader from "@/assets/tiger-header.png";

const Processing = () => {
    const navigate = useNavigate();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const duration = 3000; // 3 seconds
        const interval = 30;
        const step = (100 / (duration / interval));

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    clearInterval(timer);
                    setTimeout(() => navigate("/final"), 500);
                    return 100;
                }
                return prev + step;
            });
        }, interval);

        return () => clearInterval(timer);
    }, [navigate]);

    return (
        <PageLayout>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="w-full max-w-sm mx-auto"
            >
                <CardShell>
                    <motion.div
                        animate={{
                            scale: [1, 1.1, 1],
                            rotate: [0, 5, -5, 0]
                        }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="mb-6"
                    >
                        <img
                            src={tigerHeader}
                            alt="Tiger"
                            className="w-32 h-32 mx-auto object-contain drop-shadow-2xl"
                        />
                    </motion.div>

                    <h1 className="text-xl font-black text-white mb-2 italic">
                        VALIDANDO E PROCESSANDO O SEU SAQUE
                    </h1>
                    <p className="text-sm text-white/60 mb-8">
                        Aguarde um momento enquanto conectamos ao banco...
                    </p>

                    {/* Ultra interactive progress bar */}
                    <div className="relative h-8 w-full bg-black/60 rounded-full border-2 border-gold/30 overflow-hidden mb-4 shadow-[0_0_15px_rgba(218,165,32,0.2)]">
                        <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-gold via-yellow-300 to-gold"
                            style={{ width: `${progress}%` }}
                        >
                            <div className="absolute inset-0 bg-[linear-gradient(45deg,rgba(255,255,255,0.2)_25%,transparent_25%,transparent_50%,rgba(255,255,255,0.2)_50%,rgba(255,255,255,0.2)_75%,transparent_75%,transparent)] bg-[length:20px_20px] animate-[progress-stripe_1s_linear_infinity]" />
                        </motion.div>

                        <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xs font-black text-white drop-shadow-md">
                                {Math.round(progress)}%
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-center gap-2">
                        {[0, 1, 2].map((i) => (
                            <motion.div
                                key={i}
                                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                                transition={{ repeat: Infinity, duration: 0.6, delay: i * 0.2 }}
                                className="w-2 h-2 rounded-full bg-gold"
                            />
                        ))}
                    </div>
                </CardShell>
            </motion.div>

            <style>{`
        @keyframes progress-stripe {
          from { background-position: 0 0; }
          to { background-position: 20px 0; }
        }
      `}</style>
        </PageLayout>
    );
};

export default Processing;
