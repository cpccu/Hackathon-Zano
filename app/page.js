import Hero from "@/app/home/hero";
import HomeSections from "./home/HomeSection";
import { MyNextEvent, QuickLinks, RecentLists, StatsStrip } from "./home/HomeExtras";


export default function Home() {
  return (
    <div>
      <Hero />
      <MyNextEvent />
      <StatsStrip />
      <QuickLinks />
      <HomeSections />
      <RecentLists />
    </div>
  );
};