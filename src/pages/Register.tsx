import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate, Link } from "react-router-dom";
import PageLayout from "@/components/PageLayout";
import CardShell from "@/components/CardShell";
import GoldButton from "@/components/GoldButton";
import GoldDivider from "@/components/GoldDivider";
import tigerHeader from "@/assets/tiger-header.png";

const Register = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", phone: "" });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem("playerName", form.name);
    localStorage.setItem("playerPhone", form.phone);
    navigate("/register-success");
  };

  const inputStyle =
    "w-full px-4 py-3 rounded-xl text-sm outline-none bg-[rgba(255,255,255,0.05)] border border-[rgba(218,165,32,0.25)] text-card-foreground placeholder:text-muted-foreground focus:border-[rgba(218,165,32,0.6)] transition-colors";

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
            CRIAR CONTA
          </h1>
          <p className="text-xs text-muted-foreground mb-4">
            Registe-se e ganhe 10 jogadas grátis
          </p>

          <GoldDivider />

          <form onSubmit={handleSubmit} className="space-y-3 text-left">
            <input
              className={inputStyle}
              placeholder="Seu nome"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
            <input
              className={inputStyle}
              placeholder="Número de telefone"
              type="tel"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
              required
            />



            <div className="pt-2">
              <GoldButton type="submit">🐅 Cadastrar e Jogar</GoldButton>
            </div>
          </form>
        </CardShell>
      </motion.div>
    </PageLayout>
  );
};

export default Register;
