import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import tigerHeader from "@/assets/tiger-header.png";
import PageLayout from "@/components/PageLayout";
import CardShell from "@/components/CardShell";
import GoldButton from "@/components/GoldButton";
import GoldDivider from "@/components/GoldDivider";

const Index = () => {
  const navigate = useNavigate();

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: "easeOut" }}
      >
        <CardShell>
          {/* Tiger */}
          <motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
            className="flex justify-center mb-2"
          >
            <img
              src={tigerHeader}
              alt="Fortune Tiger"
              className="w-28 h-28 object-contain drop-shadow-2xl"
            />
          </motion.div>

          <motion.h1
            animate={{ scale: [1, 1.02, 1] }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            className="text-2xl font-extrabold mb-1"
            style={{
              background: "linear-gradient(hsl(51,100%,50%), hsl(43,76%,49%), hsl(30,100%,50%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              filter: "drop-shadow(0 0 10px rgba(255,215,0,0.5))",
            }}
          >
            PARABÉNS!
          </motion.h1>

          <p className="text-sm font-bold text-card-foreground">Bem-vindo ao Fortune Tiger</p>
          <p className="text-xs mt-1 text-muted-foreground">
            A sua conta foi selecionada para uma oferta exclusiva
          </p>

          <GoldDivider />

          <div className="flex items-center justify-center gap-2 mb-1">
            <span className="text-2xl">🎆</span>
            <div>
              <p className="text-xs" style={{ color: "hsl(43,76%,49%)" }}>Bónus de Boas-Vindas</p>
              <p
                className="text-2xl font-bold"
                style={{
                  background: "linear-gradient(hsl(142,71%,45%), hsl(142,76%,36%))",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                10 Jogadas
              </p>
            </div>
          </div>

          <p className="text-xs mb-4" style={{ color: "hsl(43,76%,49%)" }}>
            Cada jogada com aposta de <strong>1.000 Kz</strong>
          </p>

          <GoldDivider />

          <div className="text-left space-y-2 mb-6 px-2">
            {[
              <>Jogue <strong>10 rodadas gratuitas</strong> no Fortune Tiger</>,
              <>Acumule ganhos com <strong>multiplicadores elevados</strong></>,
              <>Levante os seus ganhos <strong>após as jogadas</strong></>,
            ].map((text, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 + i * 0.15 }}
                className="flex items-center gap-2 text-xs"
              >
                <span className="text-base">✅</span>
                <span className="text-card-foreground/80">{text}</span>
              </motion.div>
            ))}
          </div>

          <GoldButton onClick={() => navigate("/register")}>
            🐅 Jogar Agora
          </GoldButton>

          <p className="text-[10px] mt-3 text-muted-foreground">
            Oferta limitada · Apenas para novas contas
          </p>
        </CardShell>
      </motion.div>
    </PageLayout>
  );
};

export default Index;
