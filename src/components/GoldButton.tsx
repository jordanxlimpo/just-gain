import { motion } from "framer-motion";
import { ReactNode } from "react";

interface GoldButtonProps {
  children: ReactNode;
  onClick?: () => void;
  type?: "button" | "submit";
  disabled?: boolean;
}

const GoldButton = ({ children, onClick, type = "button", disabled }: GoldButtonProps) => {
  return (
    <motion.button
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
      onClick={onClick}
      type={type}
      disabled={disabled}
      className="w-full py-3.5 rounded-xl text-lg font-bold cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      style={{
        background: "linear-gradient(135deg, hsl(51,100%,50%), hsl(43,76%,49%), hsl(30,100%,50%))",
        color: "hsl(0,68%,6%)",
        boxShadow: "0 0 35px rgba(255,215,0,0.55)",
      }}
    >
      {children}
    </motion.button>
  );
};

export default GoldButton;
