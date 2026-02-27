import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import CardShell from "@/components/CardShell";
import GoldButton from "@/components/GoldButton";
import GoldDivider from "@/components/GoldDivider";
import tigerHeader from "@/assets/tiger-header.png";

const Withdraw = () => {
    const navigate = useNavigate();
    const [method, setMethod] = useState<"iban" | "express" | null>(null);
    const [value, setValue] = useState("");
    const [showConfirm, setShowConfirm] = useState(false);
    const balance = "121.000";

    const handleConfirm = () => {
        setShowConfirm(true);
    };

    const startProcessing = () => {
        navigate("/processing", { state: { method, value } });
    };

    const inputStyle =
        "w-full px-4 py-3 rounded-xl text-sm outline-none bg-black/40 border border-gold/20 text-white placeholder:text-white/40 focus:border-gold/60 transition-all";

    return (
        <PageLayout>
            <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
            >
                <CardShell>
                    <img
                        src={tigerHeader}
                        alt="Fortune Tiger"
                        className="w-16 h-16 mx-auto mb-2 drop-shadow-2xl"
                    />
                    <h1
                        className="text-2xl font-black mb-1"
                        style={{
                            background: "linear-gradient(180deg, hsl(51, 100%, 65%), hsl(43, 76%, 49%))",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                        }}
                    >
                        SOLICITAR SAQUE
                    </h1>
                    <p className="text-sm font-bold text-white/80 mb-4">
                        Saldo disponível: <span className="text-green-500">{balance} Kz</span>
                    </p>

                    <GoldDivider />

                    <div className="space-y-4 my-6 text-left">
                        <p className="text-xs font-bold text-gold uppercase tracking-widest text-center">
                            Escolha o método de recebimento
                        </p>

                        <div className="grid grid-cols-2 gap-3">
                            <button
                                onClick={() => setMethod("iban")}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === "iban"
                                        ? "border-gold bg-gold/10 scale-105"
                                        : "border-white/10 bg-black/20"
                                    }`}
                            >
                                <span className="text-2xl">🏦</span>
                                <span className="text-[10px] font-black uppercase">IBAN Bancário</span>
                            </button>

                            <button
                                onClick={() => setMethod("express")}
                                className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${method === "express"
                                        ? "border-gold bg-gold/10 scale-105"
                                        : "border-white/10 bg-black/20"
                                    }`}
                            >
                                <span className="text-2xl">📱</span>
                                <span className="text-[10px] font-black uppercase">Número Express</span>
                            </button>
                        </div>

                        {method && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="space-y-3 pt-2"
                            >
                                <input
                                    className={inputStyle}
                                    placeholder={method === "iban" ? "Digite seu IBAN" : "Número de Telefone"}
                                    value={value}
                                    onChange={(e) => setValue(e.target.value)}
                                />
                                <GoldButton onClick={handleConfirm} disabled={!value}>
                                    CONFIRMAR SAQUE
                                </GoldButton>
                            </motion.div>
                        )}
                    </div>

                    <p className="text-[10px] text-white/30 uppercase tracking-tighter">
                        Processamento imediato via sistema Fortune Tiger
                    </p>
                </CardShell>
            </motion.div>

            {/* Confirmation Modal */}
            <AnimatePresence>
                {showConfirm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md px-6"
                    >
                        <motion.div
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            className="relative w-full max-w-sm rounded-[2rem] p-8 text-center overflow-hidden"
                            style={{
                                background: "linear-gradient(135deg, hsl(0, 90%, 40%), hsl(0, 80%, 25%))",
                                border: "4px solid hsl(43, 76%, 49%)",
                                boxShadow: "0 0 50px rgba(218, 165, 32, 0.5)",
                            }}
                        >
                            <h2 className="text-2xl font-black text-white mb-4">CONFIRMAR DADOS</h2>
                            <div className="bg-black/40 rounded-2xl p-4 mb-6 border border-white/10 text-left space-y-2">
                                <div>
                                    <p className="text-[10px] text-gold font-bold uppercase">Valor do Saque</p>
                                    <p className="text-xl font-black text-green-400">{balance} Kz</p>
                                </div>
                                <div>
                                    <p className="text-[10px] text-gold font-bold uppercase">
                                        {method === "iban" ? "IBAN de Destino" : "Número do Beneficiário"}
                                    </p>
                                    <p className="text-sm font-bold text-white break-all">{value}</p>
                                </div>
                            </div>

                            <GoldButton onClick={startProcessing}>
                                🚀 FINALIZAR SAQUE
                            </GoldButton>

                            <button
                                onClick={() => setShowConfirm(false)}
                                className="text-xs text-white/40 mt-4 underline font-bold"
                            >
                                Corrigir dados
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </PageLayout>
    );
};

export default Withdraw;
