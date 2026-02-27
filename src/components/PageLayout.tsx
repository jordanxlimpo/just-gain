import { ReactNode } from "react";
import templeBg from "@/assets/temple-bg.jpg";

interface PageLayoutProps {
  children: ReactNode;
}

const PageLayout = ({ children }: PageLayoutProps) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0">
        <img src={templeBg} alt="" className="w-full h-full object-cover" />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(rgba(0,0,0,0.3) 0%, rgba(139,10,10,0.6) 50%, rgba(0,0,0,0.85) 100%)",
          }}
        />
      </div>
      <div className="relative z-10 w-full max-w-[380px] mx-auto px-6">
        {children}
      </div>
    </div>
  );
};

export default PageLayout;
