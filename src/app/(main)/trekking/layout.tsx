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


  return (
    <>
      {/* Hero Section */}

      {/* Main Layout */}
      <main >



          <div className="relative z-10">{children}</div>



      </main>
    </>
  );
}