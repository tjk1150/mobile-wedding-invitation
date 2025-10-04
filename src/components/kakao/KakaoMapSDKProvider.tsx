'use client';

import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type KakaoContextValue = {
  isReady: boolean;
  kakao: { maps: KakaoMapsNS } | null;
};

const KakaoContext = createContext<KakaoContextValue>({
  isReady: false,
  kakao: null,
});

export function useKakaoMaps(): KakaoContextValue {
  return useContext(KakaoContext);
}

type KakaoMapSDKProviderProps = {
  apiKey?: string;
  libraries?: string;
  children: React.ReactNode;
};

export function KakaoMapSDKProvider({
  apiKey,
  libraries = 'services',
  children,
}: KakaoMapSDKProviderProps): React.ReactElement {
  const [isReady, setIsReady] = useState(false);

  const keyFromEnv = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;
  const appKey = apiKey || keyFromEnv;

  useEffect(() => {
    if (!appKey) {
      console.warn('[KakaoMapSDK] NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY is missing');
      return;
    }

    if (typeof window === 'undefined') return;

    const w = window as Window & { kakao?: { maps?: KakaoMapsNS } };
    if (w.kakao?.maps) {
      w.kakao.maps.load?.(() => setIsReady(true));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=${libraries}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      const wk = (window as Window & { kakao?: { maps?: KakaoMapsNS } }).kakao;
      wk?.maps?.load?.(() => setIsReady(true));
    };
    script.onerror = () => {
      console.error('[KakaoMapSDK] Failed to load Kakao Maps SDK');
    };
    document.head.appendChild(script);

    return () => {
      // no-op cleanup
    };
  }, [appKey, libraries]);

  const value = useMemo(
    () => ({
      isReady,
      kakao: typeof window !== 'undefined' ? (window as Window & { kakao?: { maps: KakaoMapsNS } }).kakao ?? null : null,
    }),
    [isReady]
  );

  return (
    <KakaoContext.Provider value={value}>{children}</KakaoContext.Provider>
  );
}
