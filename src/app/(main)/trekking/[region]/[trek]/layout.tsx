'use client';

import "@/app/globals.css";
import SubHero from "@/components/subHero/SubHero";
import LeftSideBar from "@/components/trekking/main/LeftSideBar";
import { useTrekkingContext } from "@/context/TrekkingContext";
// import TrekkingRightSideBar from "@/components/Trekking/TrekkingRightSideBar";

export default function TrekkingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { siteTitle } = useTrekkingContext();
  const { backgroundImage } = useTrekkingContext();

  return (
    <>
      {/* Hero Section */}
      <SubHero siteTitle={siteTitle || "Trekking Adventures"} backgroundImage= {backgroundImage} />

      {/* Main Layout */}
      <main className="container mx-auto flex flex-col lg:flex-row gap-6 px-4 lg:px-0 py-6">
        {/* Left Sidebar */}
        <aside className="lg:block w-full lg:w-1/5">
          <LeftSideBar />
        </aside>

        {/* Main Content with glass + gradient hover effect */}
        <div className="w-full lg:w-3/5 relative overflow-hidden group">
          {/* Glass background */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-xl border border-gray-700/50 rounded-xl shadow-[0_8px_32px_rgba(0,0,0,0.3)]"></div>
          {/* Gradient sweep animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000 ease-in-out pointer-events-none"></div>
          {/* Actual content */}
          <div className="relative z-10">{children}</div>
        </div>

        {/* Right Sidebar */}
        <aside className="lg:block w-full lg:w-1/5">
          {/* <TrekkingRightSideBar /> */}
        </aside>
      </main>
    </>
  );
}