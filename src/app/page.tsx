import Navbar from '@/components/Navbar';
import ExpeditionCountdown from '@/components/ExpeditionCountdown';
import InteractiveSpider from '@/components/InteractiveSpider';
import AdBanner from '@/components/AdBanner';
import MobileAdBanner from '@/components/MobileAdBanner';
import DecorativeLines from '@/components/DecorativeLines';

export default function Home() {
  return (
    <>
      <Navbar />
      <AdBanner position="left" />
      <AdBanner position="right" />
      <MobileAdBanner />
      <ExpeditionCountdown />
      <InteractiveSpider />
      <DecorativeLines />
    </>
  );
}
