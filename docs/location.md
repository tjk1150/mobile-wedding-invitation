### Location.tsx Kakao Map 전환 설계서

본 문서는 Next.js 프로젝트의 `src/sections/Location.tsx`에서 기존 Google Maps embed 방식 대신 Kakao 지도(JS SDK)를 사용하는 방향을 정의합니다. 재사용성과 독립성을 위해 SDK 로더를 별도 컴포넌트로 분리하고, 지도 렌더링 컴포넌트를 얇게 유지합니다.

---

### 목표

- **Kakao 지도**로 전환 (Google Maps iframe 제거)
- **SDK 로더 컴포넌트 분리**로 재사용성/독립성 확보
- **클라이언트 전용** 컴포넌트로 SSR 이슈 회피
- **환경변수 기반** API 키 주입 및 배포 환경 설정 가이드 제공

---

### 아키텍처 개요

- `KakaoMapSDKProvider` (SDK 로더)

  - Kakao JS SDK 스크립트를 동적으로 주입
  - SDK 로드 완료 상태(`isReady`)와 `kakao` 객체를 컨텍스트로 제공
  - 다른 페이지/섹션에서도 재사용 가능

- `KakaoMap` (지도 표시)

  - 컨테이너 `div`에 `kakao.maps.Map` 인스턴스를 생성
  - 주소를 `kakao.maps.services.Geocoder`로 좌표 변환 후 마커 표시
  - 혹은 직접 `center` 좌표를 받아 즉시 렌더

- `Location.tsx`
  - 위 두 컴포넌트를 조합해 실제 주소/장소를 지도에 표시
  - 기존 `ADDRESS`, `VENUE` 상수 재사용

---

### 디렉터리 구조 제안

```
src/
  components/
    kakao/
      KakaoMapSDKProvider.tsx
      KakaoMap.tsx
      kakao.d.ts        # (선택) 최소 타입 선언
  sections/
    Location.tsx       # KakaoMap 사용
```

---

### 환경 변수 및 키 설정

- `.env.local` (개발 로컬)
  - `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY=카카오_JavaScript_키`
- 배포 (Vercel/Netlify 등)
  - 동일 키를 환경변수로 등록
  - Kakao Developers 콘솔에서 **허용 도메인**에 `http://localhost:3000`, 배포 도메인 추가 필수

주의: Kakao JavaScript 키는 공개 키입니다. REST API용 Secret Key는 클라이언트에 절대 노출하지 않습니다.

---

### CSP 및 보안 헤더

글로벌 보안 헤더를 `next.config.ts`에 추가할 예정인 정책에 맞춰 [[memory:9559258]] Kakao SDK 도메인을 허용해야 합니다.

- `script-src` 혹은 `script-src-elem`에 `https://dapi.kakao.com`
- 필요 시 `img-src`에 `https://t1.daumcdn.net` (Kakao 지도 타일/마커 리소스)
- 기존 Google Maps 허용 항목이 있다면 유지/정리

또한, iframe이 아닌 JS SDK를 사용하므로 `referrerPolicy`는 기존 Google iframe 설정에서 컴포넌트 단위 정책으로 이관됩니다.

---

### SDK 로더: KakaoMapSDKProvider.tsx

Kakao JS SDK를 동적으로 로딩하고, 로딩 완료 후 하위에서 `kakao` 객체를 사용할 수 있게 합니다.

```tsx
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
  kakao: any | null;
};

const KakaoContext = createContext<KakaoContextValue>({
  isReady: false,
  kakao: null,
});

export function useKakaoMaps(): KakaoContextValue {
  return useContext(KakaoContext);
}

type KakaoMapSDKProviderProps = {
  apiKey?: string; // 기본: process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY
  libraries?: string; // 예: 'services,clusterer,drawing'
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

    // 이미 로드된 경우 방어
    if ((window as any).kakao?.maps) {
      (window as any).kakao.maps.load(() => setIsReady(true));
      return;
    }

    const script = document.createElement('script');
    script.src = `https://dapi.kakao.com/v2/maps/sdk.js?appkey=${appKey}&autoload=false&libraries=${libraries}`;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      (window as any).kakao.maps.load(() => setIsReady(true));
    };
    script.onerror = () => {
      console.error('[KakaoMapSDK] Failed to load Kakao Maps SDK');
    };
    document.head.appendChild(script);

    return () => {
      // 필요 시 정리 로직 (동일 페이지 내 라우팅 반복 진입 시 메모리 관리 고려)
    };
  }, [appKey, libraries]);

  const value = useMemo(
    () => ({
      isReady,
      kakao: typeof window !== 'undefined' ? (window as any).kakao : null,
    }),
    [isReady]
  );

  return (
    <KakaoContext.Provider value={value}>{children}</KakaoContext.Provider>
  );
}
```

선택: 타입 보강이 필요하면 `src/components/kakao/kakao.d.ts`에 최소 타입을 선언합니다.

```ts
// src/components/kakao/kakao.d.ts
declare global {
  interface Window {
    kakao?: any;
  }
}
export {};
```

---

### 지도 컴포넌트: KakaoMap.tsx

주소로 마커를 찍거나, 좌표를 직접 주입해 지도를 렌더링합니다.

```tsx
'use client';

import React, { useEffect, useRef } from 'react';
import { useKakaoMaps } from './KakaoMapSDKProvider';

type LatLng = { lat: number; lng: number };

type KakaoMapProps = {
  address?: string; // 주소 → 지오코딩 후 마커 표시
  center?: LatLng; // 주소 대신 직접 좌표 제공
  level?: number; // 지도 확대 레벨 (작을수록 확대)
  marker?: boolean; // 마커 표시 여부 (기본 true)
  draggable?: boolean; // 드래그 가능 여부
  className?: string;
  style?: React.CSSProperties;
  onLoad?: (map: any) => void;
};

export default function KakaoMap({
  address,
  center,
  level = 3,
  marker = true,
  draggable = true,
  className,
  style,
  onLoad,
}: KakaoMapProps): React.ReactElement {
  const { isReady, kakao } = useKakaoMaps();
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isReady || !kakao || !containerRef.current) return;

    const mapContainer = containerRef.current;
    const defaultCenter = center
      ? new kakao.maps.LatLng(center.lat, center.lng)
      : new kakao.maps.LatLng(37.5665, 126.978); // 기본: 서울시청

    const map = new kakao.maps.Map(mapContainer, {
      center: defaultCenter,
      level,
      draggable,
    });

    const placeMarker = (lat: number, lng: number) => {
      if (!marker) return;
      const m = new kakao.maps.Marker({
        position: new kakao.maps.LatLng(lat, lng),
      });
      m.setMap(map);
      map.setCenter(new kakao.maps.LatLng(lat, lng));
    };

    if (address && kakao.maps.services) {
      const geocoder = new kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result: any[], status: string) => {
        if (status === kakao.maps.services.Status.OK && result[0]) {
          const { y, x } = result[0]; // y: lat, x: lng (문자열)
          placeMarker(parseFloat(y), parseFloat(x));
        } else {
          console.warn('[KakaoMap] Geocoding failed, falling back to center');
        }
        onLoad?.(map);
      });
    } else {
      onLoad?.(map);
    }

    return () => {
      // 카카오맵은 명시적인 destroy API가 없어 DOM 제거 수준으로 관리
    };
  }, [
    isReady,
    kakao,
    address,
    center?.lat,
    center?.lng,
    level,
    marker,
    draggable,
    onLoad,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '16em', borderRadius: 8, ...style }}
    />
  );
}
```

---

### Location.tsx 적용 예시

기존 `ADDRESS`, `VENUE` 상수를 유지하면서, Kakao SDK Provider와 Map 컴포넌트를 결합합니다.

```tsx
'use client';

import React from 'react';
import { useLang, useT } from '@/lib/i18n/LangProvider';
import { KakaoMapSDKProvider } from '@/components/kakao/KakaoMapSDKProvider';
import KakaoMap from '@/components/kakao/KakaoMap';

const ADDRESS = '인천광역시 계양구 경명대로 1108';
const VENUE = 'CN 웨딩홀 계산 베르테 홀';

export default function Location(): React.ReactElement {
  const t = useT();
  const { isKr } = useLang();

  const apiKey = process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY;

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(ADDRESS);
      alert(t('location.address_copied'));
    } catch {
      // noop
    }
  };

  return (
    <>
      <img
        src='/assets/location-top-wave.svg'
        className='location-top-wave'
        alt=''
      />
      <section className='location'>
        <h2 className={`title ${isKr ? 'kr' : 'en'}`}>{t('location.title')}</h2>
        <p className='venue en'>{VENUE}</p>
        <button className='copy-address en' onClick={copyAddress} type='button'>
          <span className='address'>{ADDRESS}</span>
        </button>

        <div className='map'>
          <KakaoMapSDKProvider apiKey={apiKey}>
            {/* 주소 기반 마커 표시 (지오코딩) */}
            <KakaoMap address={ADDRESS} level={3} />
          </KakaoMapSDKProvider>
        </div>

        <img className='location-deco' src='/assets/location-deco.svg' alt='' />
      </section>
    </>
  );
}
```

메모:

- `apiKey`는 생략 시 `process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY`를 사용하도록 `KakaoMapSDKProvider`에서 기본값 처리함.
- `services` 라이브러리를 사용하므로 SDK 로딩 시 `libraries=services`가 포함되어야 합니다.

---

### 독립성 원칙 체크리스트

- `KakaoMapSDKProvider`는 어떤 페이지에서도 재사용 가능
- `KakaoMap`은 단일 책임(지도 렌더링)에 집중, 외부 상태/스타일 의존 최소화
- `Location.tsx`는 로더/지도 컴포넌트를 합성만 하며, SDK 상세 구현에 의존하지 않음
- 환경변수/보안 헤더는 앱 전역 구성으로 분리

---

### 마이그레이션 단계

1. Kakao Developers에서 앱 생성 후 JavaScript 키 발급
2. 콘솔에서 허용 도메인에 로컬/배포 도메인 등록
3. `.env.local`에 `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY` 추가
4. `src/components/kakao/`에 SDK 로더와 지도 컴포넌트 추가
5. `src/sections/Location.tsx`에서 Google iframe 제거, Kakao 컴포넌트로 교체
6. `next.config.ts`의 CSP/보안 헤더에 Kakao 도메인 허용 추가 [[memory:9559258]]
7. 로컬 테스트 → 배포 환경 변수 설정 → 배포 검증

---

### 에러 처리 및 폴백

- 키 누락: 콘솔 경고 및 지도를 렌더하지 않음(필요 시 안내 문구 표시)
- SDK 로드 실패: 콘솔 에러 및 폴백 UI 제공 가능
- 주소 지오코딩 실패: 기본 `center`로 표기하거나 안내 문구 표시

---

### 참고 (현재 코드 스냅샷)

- 현재 `our-wedding-invitation`의 `location.svelte`는 Google Maps embed를 사용 중이며, referrerPolicy 설정을 포함합니다. 이 문서에서는 Next.js의 `Location.tsx`를 Kakao Maps로 전환하는 지침만 다룹니다.

---

### 요청할 사항 (API 키 등)

- Kakao Developers 콘솔에서 발급한 **JavaScript 키**를 제공해 주세요.
- 허용 도메인에 개발/운영 도메인을 모두 추가해 주세요.
- 제공 형식: `.env.local`에 `NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY=...` 형태로 공유(키 값은 저장소에 커밋 금지).
