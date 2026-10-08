import Hero from "@/app/home/hero";
import HomeSections from "./home/HomeSection";
import { MyNextEvent, QuickLinks, RecentLists } from "./home/HomeExtras";
import FeaturedEvents from "./home/FeaturedEvents";
import JoinUs from "./home/JoinUs";


export default function Home() {
  return (
    <div>
      <Hero />
      <MyNextEvent />
      <FeaturedEvents />
      <QuickLinks />
      <HomeSections />
      <RecentLists />
      <JoinUs />
    </div>
  );
};