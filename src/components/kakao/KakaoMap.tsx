'use client';

import React, { useEffect, useRef } from 'react';
import { useKakaoMaps } from './KakaoMapSDKProvider';

type LatLng = { lat: number; lng: number };

type KakaoMapProps = {
  address?: string;
  center?: LatLng;
  level?: number;
  marker?: boolean;
  draggable?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onLoad?: (map: KakaoMap) => void;
  debug?: boolean;
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
  debug = false,
}: KakaoMapProps): React.ReactElement {
  const { isReady, kakao } = useKakaoMaps();
  const maps = kakao?.maps;
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!isReady || !maps || !containerRef.current) return;

    const mapContainer = containerRef.current;
    const defaultCenter = center
      ? new maps.LatLng(center.lat, center.lng)
      : new maps.LatLng(37.5665, 126.978);

    const map = new maps.Map(mapContainer, {
      center: defaultCenter,
      level,
      draggable,
    });

    const placeMarker = (lat: number, lng: number) => {
      if (!marker) return;
      const adjustedLat = lat - 0.00005;
      const adjustedLng = lng - 0.00045;
      const m = new maps.Marker({
        position: new maps.LatLng(adjustedLat, adjustedLng),
      });
      m.setMap(map);
      map.setCenter(new maps.LatLng(adjustedLat, adjustedLng));
    };

    if (address && maps.services) {
      const geocoder = new maps.services.Geocoder();
      geocoder.addressSearch(address, (result: Array<{ x: string; y: string }>, status: string) => {
        if (status === maps.services.Status.OK && result[0]) {
          const { y, x } = result[0];
          if (debug) {
            console.log('[KakaoMap] Geocoding OK', {
              address,
              result: result[0],
            });
          }
          placeMarker(parseFloat(y), parseFloat(x));
        } else {
          if (debug) {
            console.warn('[KakaoMap] Geocoding failed', {
              address,
              status,
              result,
            });
          }
          // geocoding failed; keep default center
        }
        onLoad?.(map);
      });
    } else {
      if (debug) {
        console.log('[KakaoMap] Render with center only', { center });
      }
      onLoad?.(map);
    }

    return () => {
      // no explicit destroy API; DOM cleanup handled by React
    };
  }, [
    isReady,
    maps,
    address,
    center,
    center?.lat,
    center?.lng,
    level,
    marker,
    draggable,
    onLoad,
    debug,
  ]);

  return (
    <div
      ref={containerRef}
      className={className}
      style={{ width: '100%', height: '16em', borderRadius: 8, ...style }}
    />
  );
}
