"use client";

import { useLang, useT } from "@/lib/i18n/LangProvider";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";

function generateUniqueRandoms(count: number, max: number) {
  const set = new Set<number>();
  while (set.size < count) {
    set.add(Math.floor(Math.random() * max) + 1);
  }
  return Array.from(set);
}

export default function Gallery(): React.ReactElement {
  const [list, setList] = useState<number[] | null>(null);
  const t = useT();
  const { isKr } = useLang();

  useEffect(() => {
    setList(generateUniqueRandoms(30, 31)); // 1~28 중 중복 없이 10개
  }, []);

  return (
    <section className="gallery">
      <div className="header">
        <h2 className={`title ${isKr ? "kr" : "en"}`}>{t("gallery.title")}</h2>
        <p className={`sub-title ${isKr ? "kr" : "en"}`}>
          {t("gallery.sub_title")}
        </p>
      </div>

      <div id="gallery">
        {list &&
          list.map((p, idx) => (
            <a
              key={idx}
              className="slide aspect-auto"
              href={`/gallery/image${p}.webp`}
              target="_blank"
              rel="noreferrer"
            >
              <Image
                className="thumbnail"
                src={`/gallery/image${p}.webp`}
                alt=""
                width={1200}
                height={1200}
              />
            </a>
          ))}
      </div>
    </section>
  );
}
