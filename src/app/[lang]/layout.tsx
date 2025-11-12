import { ReactNode } from "react";

export default function ItemsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Base gradient background */}
      <div className="fixed inset-0 bg-linear-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a]" style={{ zIndex: -40 }} />

      {/* Background City Image */}
      <div
        className="fixed inset-0 bg-[url('/backgroundcity.png')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity"
        style={{
          filter: "grayscale(0.5) brightness(0.6) contrast(1.1)",
          zIndex: -30,
        }}
      />

      {/* Dark Overlay */}
      <div className="fixed inset-0 bg-linear-to-b from-[#0a0a0a]/70 via-[#121212]/50 to-[#0a0a0a]/70" style={{ zIndex: -25 }} />

      {/* Background Pattern */}
      <div className="fixed inset-0 bg-[url('/grid.svg')] opacity-5" style={{ zIndex: -20 }} />

      {/* Red Glow Effect */}
      {/* <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px]" style={{ zIndex: -15 }} /> */}

      {/* Content */}
      <div className="relative z-0">{children}</div>
    </div>
  );
}
