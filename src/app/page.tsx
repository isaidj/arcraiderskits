import Navbar from "@/components/Navbar";
import DataMenu from "@/components/DataMenu";
import ExpeditionCountdown from "@/components/ExpeditionCountdown";
import InteractiveSpider from "@/components/InteractiveSpider";
import AdBanner from "@/components/AdBanner";
import MobileAdBanner from "@/components/MobileAdBanner";
import DecorativeLines from "@/components/DecorativeLines";

export default function Home() {
  return (
    <>
      <AdBanner position="left" />
      <AdBanner position="right" />
      <ExpeditionCountdown />
      <MobileAdBanner />
      <InteractiveSpider />
      <DecorativeLines />
    </>
  );
}
