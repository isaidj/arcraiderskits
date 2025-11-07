import Navbar from '@/components/Navbar';
import ExpeditionCountdown from '@/components/ExpeditionCountdown';
import InteractiveSpider from '@/components/InteractiveSpider';
import AdBanner from '@/components/AdBanner';
import DecorativeLines from '@/components/DecorativeLines';

export default function Home() {
  return (
    <>
      <Navbar />
      <AdBanner position="left" />
      <AdBanner position="right" />
      <ExpeditionCountdown />
      <InteractiveSpider />
      <DecorativeLines />
    </>
  );
}
