import CountdownTimer from './CountdownTimer';

// Configuración de la fecha de finalización de la expedición
// Fecha de finalización de la primera expedición
const EXPEDITION_END_DATE = process.env.NEXT_PUBLIC_EXPEDITION_END_DATE || '2025-12-21T23:59:59';

export default function ExpeditionCountdown() {
  return (
    <div className="min-h-screen bg-linear-to-b from-[#0a0a0a] via-[#121212] to-[#0a0a0a] flex items-center justify-center relative overflow-hidden pt-16">
      {/* Background City Image */}
      <div 
        className="absolute inset-0 bg-[url('/backgroundcity.png')] bg-cover bg-center bg-no-repeat opacity-20 mix-blend-luminosity"
        style={{
          filter: 'grayscale(0.5) brightness(0.6) contrast(1.1)'
        }}
      ></div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-linear-to-b from-[#0a0a0a]/70 via-[#121212]/50 to-[#0a0a0a]/70"></div>
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5"></div>
      
      {/* Red Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[120px]"></div>

      <main className="relative z-10 flex flex-col items-center justify-center px-4 text-center">
        {/* Title */}
        <h1 className="text-5xl md:text-7xl font-bold mb-4 tracking-tight text-[#e9e1cd]">
          ARC RAIDERS
        </h1>
        <div className="h-1 w-24 bg-linear-to-r from-red-600 to-orange-500 mb-8"></div>
        
        <h2 className="text-2xl md:text-3xl font-semibold mb-4 text-[#e5a10f]">
          EXPEDITION 1
        </h2>

        {/* Countdown */}
        <CountdownTimer 
          targetDate={EXPEDITION_END_DATE}
          labels={{
            days: 'Days',
            hours: 'Hours',
            minutes: 'Minutes',
            seconds: 'Seconds',
          }}
        />
        
        <p className="text-lg md:text-xl mb-4 text-[#e9e1cd]">
          Ends on December 21, 2025
        </p>
        
        {/* Expedition Info */}
        <div className="max-w-2xl mx-auto mb-12 px-4">
          <p className="text-sm md:text-base leading-relaxed text-[#e9e1cd]">
            The Expedition is a voluntary reset system that runs in 8-week cycles. By completing it, you can send your Raider beyond the Rust Belt, resetting your progress but keeping permanent rewards and advantages for your next Raider.
          </p>
        </div>

        {/* Bottom Text */}
        <p className="mt-4 text-sm md:text-base uppercase tracking-widest text-[#e9e1cd]">
          Enlist. Resist.
        </p>
      </main>
    </div>
  );
}
