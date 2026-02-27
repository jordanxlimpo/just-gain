import { ReactNode } from "react";

interface CardShellProps {
  children: ReactNode;
}

const CardShell = ({ children }: CardShellProps) => {
  return (
    <div
      className="rounded-2xl p-6 text-center"
      style={{
        background: "linear-gradient(rgba(20,5,5,0.92), rgba(10,2,2,0.96))",
        border: "1px solid rgba(218,165,32,0.3)",
        boxShadow: "0 0 40px rgba(0,0,0,0.5)",
      }}
    >
      {children}
    </div>
  );
};

export default CardShell;
