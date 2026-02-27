import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import PageLayout from "@/components/PageLayout";
import CardShell from "@/components/CardShell";
import GoldButton from "@/components/GoldButton";
import tigerHeader from "@/assets/tiger-header.png";
import GoldDivider from "@/components/GoldDivider";

const Deposit = () => {
  const videoContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Create the vturb smart player element
    const playerDiv = document.createElement("div");
    playerDiv.innerHTML = `<vturb-smartplayer id="vid-6999185a10f8465bfaee94db" style="display: block; margin: 0 auto; width: 100%;"></vturb-smartplayer>`;
    
    if (videoContainerRef.current) {
      videoContainerRef.current.appendChild(playerDiv);
    }

    // Load the player script
    const script = document.createElement("script");
    script.src = "https://scripts.converteai.net/fb9b0378-792c-45bc-866f-e9fdc603bbbe/players/6999185a10f8465bfaee94db/v4/player.js";
    script.async = true;
    document.head.appendChild(script);

    return () => {
      script.remove();
      if (videoContainerRef.current) {
        videoContainerRef.current.innerHTML = "";
      }
    };
  }, []);

  const handlePay = () => {
    window.open("https://culonga.com/checkout/8b492846-f283-4c2c-9a65-617c5e975c7d", "_blank");
  };

  return (
    <PageLayout>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        <CardShell>
          <img
            src={tigerHeader}
            alt="Fortune Tiger"
            className="w-20 h-20 object-contain mx-auto mb-2 drop-shadow-2xl"
          />
          <h1
            className="text-xl font-extrabold mb-1"
            style={{
              background: "linear-gradient(hsl(51,100%,50%), hsl(43,76%,49%), hsl(30,100%,50%))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            RETIRAR SALDO
          </h1>
          <p className="text-xs text-muted-foreground mb-2">
            Assista o vídeo para retirar o seu saldo
          </p>

          <GoldDivider />

          <div
            ref={videoContainerRef}
            className="w-full rounded-xl overflow-hidden mb-4"
            style={{
              background: "rgba(0,0,0,0.6)",
              border: "1px solid rgba(218,165,32,0.3)",
              minHeight: "200px",
            }}
          />

          <GoldDivider />

          <GoldButton onClick={handlePay}>
            🔒 Pagar Taxa Anti-Robô
          </GoldButton>

          <p className="text-[10px] mt-3 text-muted-foreground">
            Pagamento seguro · Processamento instantâneo
          </p>
        </CardShell>
      </motion.div>
    </PageLayout>
  );
};

export default Deposit;
