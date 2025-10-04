"use client";
import Account from "@/sections/Account";
import Calendar from "@/sections/Calendar";
import Cover from "@/sections/Cover";
import Gallery from "@/sections/Gallery";
import Letter from "@/sections/Letter";
import Location from "@/sections/Location";
import { useEffect } from "react";
import "aos/dist/aos.css";
import AOS from "aos";

export default function Home() {
  useEffect(() => {
    AOS.init({ startEvent: "DOMContentLoaded", delay: 300, duration: 1000 });

    // AOS는 스크롤 시 업데이트가 필요하므로
    AOS.refresh();
  }, []);

  return (
    <div
      className="min-h-screen flex flex-col items-stretch"
      style={{ display: "contents" }}
    >
      <Cover />
      <Letter />
      <Calendar />
      <Gallery />
      <Account />
      <Location />
    </div>
  );
}
