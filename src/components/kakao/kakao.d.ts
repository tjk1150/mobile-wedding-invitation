declare global {
  interface KakaoLatLng {
    getLat(): number;
    getLng(): number;
  }
  interface KakaoMap {
    setCenter(latlng: KakaoLatLng): void;
    getCenter(): KakaoLatLng;
  }
  interface KakaoMarker {
    setMap(map: KakaoMap | null): void;
  }
  interface KakaoGeocoder {
    addressSearch(
      address: string,
      callback: (result: Array<{ x: string; y: string }>, status: string) => void
    ): void;
  }
  interface KakaoMapsNS {
    LatLng: new (lat: number, lng: number) => KakaoLatLng;
    Map: new (
      container: HTMLElement,
      options: { center: KakaoLatLng; level?: number; draggable?: boolean }
    ) => KakaoMap;
    Marker: new (options: { position: KakaoLatLng }) => KakaoMarker;
    services: {
      Geocoder: new () => KakaoGeocoder;
      Status: { OK: string };
    };
    load?: (cb: () => void) => void;
  }
  interface Window {
    kakao?: { maps: KakaoMapsNS };
  }
}
export {};
