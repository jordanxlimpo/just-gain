import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import CardShell from "@/components/CardShell";
import GoldButton from "@/components/GoldButton";
import GoldDivider from "@/components/GoldDivider";
import tigerHeader from "@/assets/tiger-header.png";
import { useEffect } from "react";
import { sounds, resumeAudio } from "@/lib/sounds";

const COMMENTS = [
  {
    user: "@maria_f",
    time: "há 2 minutos",
    text: "Ainda estou emocionada 🙏. Joguei o Fortune Tiger, ganhei e recebi os 115.000 KZ sem complicações. Foi tudo muito rápido e simples. Quem tiver oportunidade, aproveite.",
  },
  {
    user: "@joao_k",
    time: "há 5 minutos",
    text: "No início pensei que fosse só conversa, mas resolvi tentar. Joguei, ganhei e o dinheiro caiu mesmo. Funcionou certinho 💰",
  },
  {
    user: "@ana_luisa",
    time: "há 8 minutos",
    text: "Recebi 98.000 KZ na minha conta! Incrível como funciona rápido. Recomendo a todos! 🐅🎉",
  },
  {
    user: "@carlos_m",
    time: "há 12 minutos",
    text: "Já é a segunda vez que jogo e ganho. Desta vez foram 121.000 KZ. Fortune Tiger é real! 🔥",
  },
  {
    user: "@sofia_d",
    time: "há 15 minutos",
    text: "Minha amiga me indicou e eu não acreditei até jogar. Ganhei 87.000 KZ nas rodadas grátis! Obrigada Fortune Tiger 🙌",
  },
];

const RegisterSuccess = () => {
  const navigate = useNavigate();

  useEffect(() => {
    resumeAudio();
    sounds.success();
  }, []);

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
        className="space-y-4"
      >
        {/* Top section with tiger */}
        <div className="text-center">
          <img
            src={tigerHeader}
            alt="Fortune Tiger"
            className="w-20 h-20 object-contain mx-auto mb-2 drop-shadow-2xl"
          />
          <h1
            className="text-xl font-extrabold"
            style={{
              background: "linear-gradient(hsl(142,71%,45%), hsl(142,76%,36%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Cadastre-se
          </h1>
          <p className="text-xs text-muted-foreground">
            e ganhe <span style={{ color: "hsl(142,71%,45%)" }} className="font-bold">10 rodadas grátis</span> no Fortune Tiger
          </p>
        </div>

        {/* Success card */}
        <div
          className="rounded-2xl p-5 text-center"
          style={{
            background: "rgba(10,2,2,0.9)",
            border: "1px solid rgba(34,197,94,0.4)",
            boxShadow: "0 0 30px rgba(34,197,94,0.1)",
          }}
        >
          <div className="text-4xl mb-2">🎉</div>
          <h2
            className="text-lg font-extrabold mb-1"
            style={{
              background: "linear-gradient(hsl(142,71%,45%), hsl(142,76%,36%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Parabéns!
          </h2>
          <p className="text-sm font-bold text-card-foreground">
            Cadastro realizado com sucesso!
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Você ganhou <span style={{ color: "hsl(142,71%,45%)" }} className="font-bold">10 rodadas grátis</span> no Fortune Tiger
          </p>

          <div className="flex items-center justify-center gap-2 my-4">
            <span className="text-2xl">🟨</span>
            <p
              className="text-2xl font-extrabold"
              style={{
                background: "linear-gradient(hsl(51,100%,50%), hsl(30,100%,50%))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              10 Rodadas Grátis
            </p>
          </div>

          <GoldButton onClick={() => navigate("/game")}>
            🐅 Começar a Jogar
          </GoldButton>
        </div>

        {/* Comments section */}
        <div>
          <p className="text-xs font-bold text-muted-foreground mb-3 flex items-center gap-1">
            💬 Comentários Recentes
          </p>
          <div className="space-y-3">
            {COMMENTS.map((comment, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 + i * 0.15 }}
                className="rounded-xl px-4 py-3"
                style={{
                  background: "rgba(10,2,2,0.8)",
                  border: "1px solid rgba(218,165,32,0.1)",
                }}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-bold text-card-foreground">
                    {comment.user}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {comment.time}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {comment.text}
                </p>
                <div className="flex gap-3 mt-2 text-[10px] text-muted-foreground">
                  <span className="cursor-pointer">👍</span>
                  <span className="cursor-pointer">👎</span>
                  <span className="cursor-pointer">Responder</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </PageLayout>
  );
};

export default RegisterSuccess;
