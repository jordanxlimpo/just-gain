import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import GoldButton from "@/components/GoldButton";
import MoneyRain from "@/components/MoneyRain";
import tigerHeader from "@/assets/tiger-header.png";
import { sounds, resumeAudio } from "@/lib/sounds";

const SYMBOLS = ["🏮", "🔔", "💰", "🧧", "🐅", "🎆"];
const ROWS = 3;
const COLS = 3;
const MAX_BALANCE = 121000;
const TOTAL_SPINS = 10;
const BET_AMOUNT = 500;

const getRandomSymbol = () => SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)];
const generateGrid = () =>
  Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, getRandomSymbol)
  );

// Mix of wins and losses, building to ~121k
const SPIN_RESULTS: { grid: string[][]; win: number }[] = [
  { grid: [["🏮", "🔔", "💰"], ["🧧", "🐅", "🧧"], ["🏮", "🏮", "🏮"]], win: 8500 },
  { grid: [["💰", "🔔", "🧧"], ["🐅", "🏮", "🎆"], ["🧧", "🔔", "🏮"]], win: 0 },
  { grid: [["💰", "💰", "💰"], ["🔔", "🏮", "🧧"], ["🐅", "🔔", "🏮"]], win: 15000 },
  { grid: [["🧧", "🔔", "🏮"], ["🐅", "🐅", "🐅"], ["💰", "🧧", "🔔"]], win: 25000 },
  { grid: [["🔔", "🏮", "🐅"], ["💰", "🧧", "🏮"], ["🎆", "🔔", "🧧"]], win: 0 },
  { grid: [["🐅", "🏮", "🔔"], ["🏮", "🏮", "🏮"], ["🔔", "💰", "🧧"]], win: 12000 },
  { grid: [["💰", "🧧", "🐅"], ["🔔", "💰", "🔔"], ["🐅", "🐅", "🐅"]], win: 18000 },
  { grid: [["🏮", "🏮", "🏮"], ["🐅", "🐅", "🐅"], ["💰", "💰", "💰"]], win: 22000 },
  { grid: [["🧧", "🏮", "💰"], ["🔔", "🐅", "🧧"], ["🎆", "🔔", "🏮"]], win: 0 },
  { grid: [["🐅", "🐅", "🐅"], ["💰", "💰", "💰"], ["🧧", "🧧", "🧧"]], win: 20500 },
];

const Game = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState(generateGrid);
  const [spinning, setSpinning] = useState(false);
  const [spinIndex, setSpinIndex] = useState(0);
  const [spinsLeft, setSpinsLeft] = useState(TOTAL_SPINS);
  const [balance, setBalance] = useState(0);
  const [lastWin, setLastWin] = useState(0);
  const [showMoneyRain, setShowMoneyRain] = useState(false);
  const [showLoss, setShowLoss] = useState(false);
  const [canWithdraw, setCanWithdraw] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const spinIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [playerName] = useState(() => localStorage.getItem("playerName") || "Jogador");
  const [marqueeText] = useState("🐅 Ganhe grandes prémios! 🎰 Multiplicadores até 2500x 💰 Fortune Tiger - O jogo mais popular de Angola! 🏮");

  useEffect(() => {
    if (balance >= MAX_BALANCE) {
      setCanWithdraw(true);
    }
  }, [balance]);

  const handleMoneyRainComplete = useCallback(() => {
    setShowMoneyRain(false);
  }, []);

  const spin = useCallback(() => {
    if (spinsLeft <= 0 || spinning || showMoneyRain) return;
    resumeAudio();
    sounds.spin();
    setSpinning(true);
    setShowLoss(false);

    let count = 0;
    spinIntervalRef.current = setInterval(() => {
      setGrid(generateGrid());
      sounds.reel();
      count++;
      if (count >= 15) {
        clearInterval(spinIntervalRef.current!);

        const result = SPIN_RESULTS[spinIndex % SPIN_RESULTS.length];
        setGrid(result.grid);
        setSpinning(false);
        setSpinsLeft((p) => p - 1);
        setSpinIndex((p) => p + 1);

        if (result.win > 0) {
          setLastWin(result.win);
          setBalance((p) => Math.min(p + result.win, MAX_BALANCE));
          setShowMoneyRain(true);
          if (result.win >= 15000) {
            sounds.bigWin();
          } else {
            sounds.win();
          }
        } else {
          // Loss
          setShowLoss(true);
          sounds.click();
          setTimeout(() => setShowLoss(false), 2000);
        }
      }
    }, 80);
  }, [spinsLeft, spinning, spinIndex, showMoneyRain]);

  const handleWithdraw = () => {
    resumeAudio();
    sounds.withdraw();
    setShowWithdrawModal(true);
  };

  const lineNumbers = [1, 2, 3];

  return (
    <PageLayout>
      {/* Money Rain Overlay */}
      <MoneyRain
        show={showMoneyRain}
        winAmount={lastWin}
        onComplete={handleMoneyRainComplete}
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full"
        onClick={resumeAudio}
      >
        {/* Top bar with player name */}
        <div className="flex justify-between items-center mb-2">
          <div
            className="px-3 py-1 rounded-lg text-xs font-bold"
            style={{
              background: "rgba(0,0,0,0.85)",
              border: "1px solid rgba(218,165,32,0.4)",
              color: "hsl(43,76%,49%)",
            }}
          >
            RODADAS
            <br />
            <span style={{ color: "hsl(142,71%,45%)" }}>
              {TOTAL_SPINS - spinsLeft}/{TOTAL_SPINS}
            </span>
          </div>

          <div className="text-center">
            <h1
              className="text-lg font-extrabold tracking-wider"
              style={{
                background: "linear-gradient(hsl(0,80%,50%), hsl(0,70%,40%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              FORTUNE TIGER
            </h1>
            <p className="text-[10px] font-semibold" style={{ color: "hsl(43,76%,49%)" }}>
              Olá, {playerName} 👋
            </p>
          </div>

          <div
            className="px-3 py-1 rounded-lg text-xs font-bold text-right"
            style={{
              background: "rgba(0,0,0,0.85)",
              border: "1px solid rgba(218,165,32,0.4)",
              color: "hsl(43,76%,49%)",
            }}
          >
            SALDO
            <br />
            <span style={{ color: "hsl(142,71%,45%)" }}>
              {balance.toLocaleString()} Kz
            </span>
          </div>
        </div>

        {/* Tiger avatar */}
        <div className="flex justify-center -mb-6 relative z-20">
          <motion.div
            animate={{ y: [0, -3, 0] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden"
            style={{
              background: "linear-gradient(135deg, hsl(197,71%,73%), hsl(197,50%,85%))",
              border: "3px solid hsl(43,76%,49%)",
              boxShadow: "0 4px 20px rgba(0,0,0,0.4), 0 0 15px rgba(218,165,32,0.3)",
            }}
          >
            <img src={tigerHeader} alt="Tiger" className="w-16 h-16 object-contain" />
          </motion.div>
        </div>

        {/* Slot machine frame */}
        <div
          className="rounded-2xl pt-10 pb-4 px-2 relative overflow-hidden"
          style={{
            background: "linear-gradient(135deg, hsl(43,76%,49%), hsl(51,100%,50%), hsl(43,76%,49%))",
            boxShadow: "0 0 30px rgba(218,165,32,0.3), inset 0 0 20px rgba(0,0,0,0.2)",
          }}
        >
          {/* Shine effect */}
          <motion.div
            animate={{ x: ["-100%", "200%"] }}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            className="absolute top-0 left-0 w-1/3 h-full opacity-20 pointer-events-none"
            style={{
              background: "linear-gradient(90deg, transparent, white, transparent)",
            }}
          />

          {/* Grid with line numbers */}
          <div className="flex items-stretch gap-1">
            {/* Left line numbers */}
            <div className="flex flex-col justify-around py-1">
              {lineNumbers.map((n) => (
                <div
                  key={`l${n}`}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: "hsl(0,80%,45%)",
                    color: "white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {n}
                </div>
              ))}
            </div>

            {/* Slot grid */}
            <div className="flex-1 grid grid-cols-3 gap-1">
              {grid.flat().map((symbol, i) => (
                <motion.div
                  key={i}
                  animate={spinning ? { y: [0, -10, 10, 0], scale: [1, 0.95, 1.05, 1] } : {}}
                  transition={{
                    duration: 0.08,
                    repeat: spinning ? Infinity : 0,
                  }}
                  className="flex items-center justify-center text-3xl rounded-lg aspect-square relative"
                  style={{
                    background: "linear-gradient(135deg, rgba(255,255,255,0.95), rgba(240,230,210,0.95))",
                    boxShadow: "inset 0 2px 6px rgba(0,0,0,0.15), 0 1px 2px rgba(0,0,0,0.1)",
                  }}
                >
                  {symbol}
                </motion.div>
              ))}
            </div>

            {/* Right line numbers */}
            <div className="flex flex-col justify-around py-1">
              {[5, 2, 4].map((n) => (
                <div
                  key={`r${n}`}
                  className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold"
                  style={{
                    background: "hsl(0,80%,45%)",
                    color: "white",
                    boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
                  }}
                >
                  {n}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Marquee */}
        <div
          className="overflow-hidden py-1.5 mt-2 rounded-lg text-xs"
          style={{
            background: "rgba(0,0,0,0.85)",
            border: "1px solid rgba(218,165,32,0.2)",
          }}
        >
          <motion.div
            animate={{ x: ["100%", "-100%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
            className="whitespace-nowrap"
            style={{ color: "hsl(43,76%,49%)" }}
          >
            {marqueeText}
          </motion.div>
        </div>

        {/* Stats bar */}
        <div className="grid grid-cols-3 gap-2 mt-2 text-center text-[10px]">
          {[
            { label: "SALDO", value: `${balance.toLocaleString()} Kz`, icon: "💰" },
            { label: "APOSTA", value: `${BET_AMOUNT} Kz`, icon: "🎲" },
            { label: "GANHO", value: `${lastWin.toLocaleString()} Kz`, icon: "🏆" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-lg py-2 px-1"
              style={{
                background: "rgba(0,0,0,0.85)",
                border: "1px solid rgba(218,165,32,0.25)",
              }}
            >
              <div className="text-muted-foreground">
                {stat.icon} {stat.label}
              </div>
              <div className="font-bold text-xs" style={{ color: "hsl(43,76%,49%)" }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Loss display */}
        <AnimatePresence>
          {showLoss && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.5 }}
              className="text-center my-3"
            >
              <p className="text-lg font-bold text-muted-foreground">
                Sem sorte desta vez... 😔
              </p>
              <p className="text-xs text-muted-foreground">Tente novamente!</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3 mt-3">
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold cursor-pointer"
            style={{
              background: "rgba(0,0,0,0.85)",
              border: "1px solid rgba(218,165,32,0.4)",
              color: "hsl(43,76%,49%)",
            }}
            onClick={() => { resumeAudio(); sounds.click(); }}
          >
            ⚡
          </button>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg cursor-pointer"
            style={{
              background: "rgba(0,0,0,0.85)",
              border: "1px solid rgba(218,165,32,0.4)",
              color: "hsl(43,76%,49%)",
            }}
            onClick={() => { resumeAudio(); sounds.click(); }}
          >
            −
          </button>

          {/* Main JOGAR button */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={spin}
            disabled={spinning || spinsLeft <= 0 || showMoneyRain}
            className="w-16 h-16 rounded-full text-sm font-extrabold cursor-pointer disabled:opacity-50"
            style={{
              background: spinsLeft > 0
                ? "linear-gradient(135deg, hsl(142,71%,45%), hsl(142,50%,35%))"
                : "rgba(100,100,100,0.5)",
              color: "white",
              boxShadow: spinsLeft > 0 ? "0 0 20px rgba(34,197,94,0.4), 0 0 40px rgba(34,197,94,0.1)" : "none",
              border: "3px solid rgba(255,255,255,0.2)",
            }}
          >
            {spinning ? "..." : "JOGAR"}
          </motion.button>

          <button
            className="w-10 h-10 rounded-full flex items-center justify-center text-lg cursor-pointer"
            style={{
              background: "rgba(0,0,0,0.85)",
              border: "1px solid rgba(218,165,32,0.4)",
              color: "hsl(43,76%,49%)",
            }}
            onClick={() => { resumeAudio(); sounds.click(); }}
          >
            +
          </button>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center text-xs font-bold cursor-pointer"
            style={{
              background: "rgba(0,0,0,0.85)",
              border: "1px solid rgba(218,165,32,0.4)",
              color: "hsl(43,76%,49%)",
            }}
            onClick={() => { resumeAudio(); sounds.click(); }}
          >
            AUTO
          </button>
        </div>

        {/* Withdraw button */}
        {(canWithdraw || spinsLeft <= 0) && !showMoneyRain && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3"
          >
            {canWithdraw ? (
              <GoldButton onClick={handleWithdraw}>
                💰 LEVANTAR {balance.toLocaleString()} Kz
              </GoldButton>
            ) : (
              <div className="text-center">
                <p className="text-xs text-muted-foreground mb-2">
                  Jogadas esgotadas. Deposite para continuar jogando!
                </p>
                <GoldButton onClick={() => navigate("/withdraw")}>
                  💰 Sacar Meus Ganhos
                </GoldButton>
              </div>
            )}
          </motion.div>
        )}

        {/* Withdraw Modal */}
        <AnimatePresence>
          {showWithdrawModal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md px-6"
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="relative w-full max-w-sm rounded-[2rem] p-8 text-center overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, hsl(0, 90%, 40%), hsl(0, 80%, 25%))",
                  border: "4px solid hsl(43, 76%, 49%)",
                  boxShadow: "0 0 50px rgba(218, 165, 32, 0.5), inset 0 0 30px rgba(255, 215, 0, 0.2)",
                }}
              >
                {/* Glossy overlay */}
                <div className="absolute top-0 left-0 w-full h-1/2 bg-white/5 skew-y-[-10deg] -translate-y-1/2 pointer-events-none" />

                <div className="text-4xl mb-3">🎉💰🎉</div>
                <h2
                  className="text-2xl font-black mb-2 tracking-tighter"
                  style={{
                    background: "linear-gradient(180deg, hsl(51, 100%, 65%), hsl(43, 76%, 49%), hsl(30, 100%, 45%))",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.5))",
                  }}
                >
                  PARABÉNS, {playerName}!
                </h2>
                <div className="bg-black/40 rounded-2xl py-4 px-2 mb-6 border border-white/10">
                  <p className="text-white/80 text-sm font-bold mb-1">
                    SEU SALDO ESTÁ PRONTO
                  </p>
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
                    {balance.toLocaleString()} Kz
                  </motion.p>
                </div>
                <p className="text-white/80 text-xs mb-4 px-4 font-semibold">
                  Para efetuar o saque agora, realize o depósito mínimo de verificação.
                </p>
                <GoldButton onClick={() => navigate("/withdraw")}>
                  CONTINUAR PARA SAQUE
                </GoldButton>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </PageLayout>
  );
};

export default Game;
