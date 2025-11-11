import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex items-center justify-center relative overflow-hidden">
      {/* Background City Image */}
      <div
        className="absolute inset-0 bg-[url('/backgroundcity.png')] bg-cover bg-center bg-no-repeat opacity-10 mix-blend-luminosity"
        style={{
          filter: "grayscale(0.7) brightness(0.4) contrast(1.2)",
        }}
      ></div>

      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0a]/80 via-[#121212]/60 to-[#0a0a0a]/80"></div>

      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>

      {/* Cyan Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#00ffff]/10 rounded-full blur-[120px]"></div>

      {/* Secondary Red Glow */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-red-600/5 rounded-full blur-[100px]"></div>

      {/* Glitch Lines Effect */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-[20%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#00ffff]/30 to-transparent animate-pulse"></div>
        <div
          className="absolute top-[60%] left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-600/30 to-transparent animate-pulse"
          style={{ animationDelay: "0.5s" }}
        ></div>
      </div>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 text-center max-w-3xl">
        {/* Error Code */}
        <div className="mb-8 relative">
          <h1 className="text-[10rem] md:text-[15rem] font-bold leading-none text-transparent bg-clip-text bg-gradient-to-b from-[#00ffff] via-[#00ffff]/80 to-transparent opacity-20 select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-6xl md:text-8xl font-bold text-[#00ffff] drop-shadow-[0_0_20px_rgba(0,255,255,0.5)]">404</div>
          </div>
        </div>

        {/* Decorative Line */}
        <div className="h-1 w-32 bg-gradient-to-r from-[#00ffff] via-cyan-400 to-[#00ffff] mb-8 shadow-[0_0_10px_rgba(0,255,255,0.5)]"></div>

        {/* Title */}
        <h2 className="text-3xl md:text-5xl font-bold mb-6 tracking-tight text-[#e9e1cd]">SIGNAL LOST</h2>

        {/* Description */}
        <p className="text-base md:text-lg mb-4 text-[#e9e1cd]/80 leading-relaxed max-w-xl">
          The coordinates you entered don&apos;t exist in our database. The area might have been consumed by the ARC or never mapped.
        </p>

        {/* Additional Info */}
        <div className="mb-12 px-6 py-4 bg-[#0d111d]/50 backdrop-blur-sm border border-[#00ffff]/20 rounded-lg">
          <p className="text-sm text-gray-400 font-mono">
            <span className="text-red-500">ERROR:</span> RESOURCE_NOT_FOUND
          </p>
          <p className="text-xs text-gray-500 mt-1">Unable to establish connection to requested destination</p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <Link
            href="/"
            className="group relative px-8 py-4 bg-gradient-to-r from-[#00ffff]/10 to-[#00ffff]/5 border-2 border-[#00ffff] rounded-lg font-semibold text-[#00ffff] hover:bg-[#00ffff]/20 transition-all duration-300 overflow-hidden"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                />
              </svg>
              Return to Base
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#00ffff]/20 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700"></div>
          </Link>

          <Link
            href="/en/items"
            className="group relative px-8 py-4 bg-gradient-to-r from-gray-800/50 to-gray-900/50 border-2 border-gray-700 rounded-lg font-semibold text-gray-300 hover:border-[#00ffff]/50 hover:text-[#00ffff] transition-all duration-300"
          >
            <span className="relative z-10 flex items-center gap-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Browse Items
            </span>
          </Link>
        </div>

        {/* Bottom Text */}
        <p className="mt-8 text-sm uppercase tracking-widest text-[#e9e1cd]/60 flex items-center gap-2">
          <span className="inline-block w-2 h-2 bg-[#00ffff] rounded-full animate-pulse shadow-[0_0_10px_rgba(0,255,255,0.8)]"></span>
          STAY VIGILANT
        </p>
      </main>

      {/* Corner Decorations */}
      <div className="absolute top-8 left-8 w-16 h-16 border-l-2 border-t-2 border-[#00ffff]/30"></div>
      <div className="absolute top-8 right-8 w-16 h-16 border-r-2 border-t-2 border-[#00ffff]/30"></div>
      <div className="absolute bottom-8 left-8 w-16 h-16 border-l-2 border-b-2 border-[#00ffff]/30"></div>
      <div className="absolute bottom-8 right-8 w-16 h-16 border-r-2 border-b-2 border-[#00ffff]/30"></div>
    </div>
  );
}
