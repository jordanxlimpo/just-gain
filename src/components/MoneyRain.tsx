import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import GoldButton from "./GoldButton";
import tigerHeader from "@/assets/tiger-header.png";

interface MoneyRainProps {
  show: boolean;
  winAmount: number;
  onComplete: () => void;
}

const MONEY_EMOJIS = ["💰", "💵", "🪙", "💎", "🧧"];

const MoneyRain = ({ show, winAmount, onComplete }: MoneyRainProps) => {
  const [particles, setParticles] = useState<
    { id: number; emoji: string; left: number; delay: number; duration: number; size: number }[]
  >([]);

  useEffect(() => {
    if (show) {
      const newParticles = Array.from({ length: 40 }, (_, i) => ({
        id: i,
        emoji: MONEY_EMOJIS[Math.floor(Math.random() * MONEY_EMOJIS.length)],
        left: Math.random() * 100,
        delay: Math.random() * 2,
        duration: 2 + Math.random() * 3,
        size: 16 + Math.random() * 20,
      }));
      setParticles(newParticles);
    } else {
      setParticles([]);
    }
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.5 } }}
          className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden px-6"
        >
          {/* Dark overlay */}
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />

          {/* Money particles */}
          <div className="absolute inset-0 pointer-events-none">
            {particles.map((p) => (
              <motion.div
                key={p.id}
                initial={{ y: -50, x: `${p.left}vw`, opacity: 0, rotate: 0 }}
                animate={{
                  y: "110vh",
                  opacity: [0, 1, 1, 0.5],
                  rotate: [0, 360, 720],
                }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  ease: "easeIn",
                }}
                className="absolute top-0"
                style={{ fontSize: p.size, left: 0 }}
              >
                {p.emoji}
              </motion.div>
            ))}
          </div>

          {/* Win Pop-up Card */}
          <motion.div
            initial={{ scale: 0.5, y: 50, opacity: 0 }}
            animate={{ scale: 1, y: 0, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", damping: 15, stiffness: 200 }}
            className="relative w-full max-w-sm rounded-[2rem] p-8 text-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(0, 90%, 40%), hsl(0, 80%, 25%))",
              border: "4px solid hsl(43, 76%, 49%)",
              boxShadow: "0 0 50px rgba(218, 165, 32, 0.5), inset 0 0 30px rgba(255, 215, 0, 0.2)",
            }}
          >
            {/* Glossy overlay */}
            <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 skew-y-[-10deg] -translate-y-1/2 pointer-events-none" />

            <motion.div
              animate={{ y: [0, -5, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-4"
            >
              <img
                src={tigerHeader}
                alt="Tiger"
                className="w-24 h-24 mx-auto object-contain drop-shadow-[0_0_15px_rgba(255,255,255,0.4)]"
              />
            </motion.div>

            <h2
              className="text-4xl font-black mb-2 tracking-tighter"
              style={{
                background: "linear-gradient(180deg, hsl(51, 100%, 65%), hsl(43, 76%, 49%), hsl(30, 100%, 45%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
              }}
            >
              GRANDE VITÓRIA!
            </h2>

            <div className="bg-black/40 rounded-2xl py-4 px-2 mb-6 border border-white/10">
              <p className="text-white/80 text-sm font-bold mb-1">VOCÊ RECEBEU</p>
              <motion.p
                initial={{ scale: 0.8 }}
                animate={{ scale: [0.8, 1.1, 1] }}
                className="text-4xl font-black"
                style={{
                  background: "linear-gradient(180deg, hsl(142, 71%, 55%), hsl(142, 76%, 36%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  filter: "drop-shadow(0 0 10px rgba(34,197,94,0.4))",
                }}
              >
                {winAmount.toLocaleString()} Kz
              </motion.p>
            </div>

            <GoldButton onClick={onComplete}>
              🚀 CONTINUAR GANHANDO
            </GoldButton>

            <p className="text-white/40 text-[10px] mt-4 uppercase tracking-widest font-bold">
              Fortune Tiger Premium
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default MoneyRain;
