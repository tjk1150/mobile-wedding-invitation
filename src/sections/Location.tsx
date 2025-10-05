"use client";

import KakaoMap from "@/components/kakao/KakaoMap";
import { KakaoMapSDKProvider } from "@/components/kakao/KakaoMapSDKProvider";
import { useLang, useT } from "@/lib/i18n/LangProvider";
import { MapPinIcon } from "@heroicons/react/16/solid";
import React from "react";

const ADDRESS = "인천광역시 계양구 경명대로 1108";
const VENUE = "CN 웨딩홀 계산 베르테 홀";

export default function Location(): React.ReactElement {
  const t = useT();
  const { isKr } = useLang();

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      alert(t("location.address_copied"));
    } catch {}
  };

  const locationData = [
    {
      title: "지하철",
      description: ["인천지하철 : 계산역 1번 출구"],
    },
    {
      title: "버스",
      description: [
        "간선 : 24-1, 30,79,80",
        "마을 : 584-1, 588",
        "일반 : 81,88",
        "광역 : 1500,9500",
        "좌석 : 111, 111B, 302",
        "시외: 3000, 3030, 5000",
      ],
    },
    {
      title: "2시간 무료주차",
    },
  ];

  return (
    <section className="location">
      <hgroup className="kr">
        <h2 className={`title kr`}>{t("location.title")}</h2>
        <p className="venue kr">{VENUE}</p>
      </hgroup>
      <button className="copy-address kr" onClick={copyAddress} type="button">
        <MapPinIcon className="w-4 h-4" />
        <span className="address">{ADDRESS}</span>
      </button>
      <div className="map">
        <KakaoMapSDKProvider>
          <KakaoMap
            address={ADDRESS}
            level={3}
            debug
            onLoad={(map) => {
              const c = map.getCenter();
              console.log("[KakaoMap] center lat/lng:", c.getLat(), c.getLng());
            }}
          />
        </KakaoMapSDKProvider>
      </div>
      <div className="kr bg-[#E8D8CD] rounded-2xl w-full p-8">
        <ul>
          {locationData.map((item, index) => {
            return (
              <li key={index} className="!mb-6" data-aos="fade-up">
                <hgroup className="text-md font-bold mb-1">{item.title}</hgroup>
                {item.description && item.description?.length > 0 && (
                  <div className="leading-[2]">
                    {item.description.map((i, idx) => {
                      return <div key={idx}>{i}</div>;
                    })}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      </div>
      <img className="location-deco" src="/assets/location-deco.svg" alt="" />
    </section>
  );
}
