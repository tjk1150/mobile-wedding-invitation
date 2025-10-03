### 목적

- SvelteKit 기반 `our-wedding-invitation`을 Next.js(`mobile-wedding-invitation`)로 마이그레이션.
- 동일한 기능/UX(i18n, RSVP 메일 전송, 갤러리, 위치 안내)를 Next.js App Router 상에서 제공.

---

### 타겟 런타임 / 배포

- Next.js 15(App Router), React 19, TypeScript 5
- Netlify 배포 (`netlify.toml` + `@netlify/plugin-nextjs`)
- TailwindCSS

---

### 아키텍처 매핑

- 페이지 구조(App Router)
  - `src/app/layout.tsx`: 전역 레이아웃/글로벌 스타일/폰트
  - `src/app/page.tsx`: 단일 페이지 구성(섹션 컴포넌트로 분리)
  - 섹션 컴포넌트: `src/app/(sections)/Cover.tsx`, `Letter.tsx`, `Calendar.tsx`, `Rsvp.tsx`, `Gallery.tsx`, `Location.tsx`
- 정적 자산
  - `src/lib/assets/**` → `public/**`로 이동(Next 이미지/정적 서빙)
- 스타일
  - 만들어진 `globals.css`, `variable.css`를 수정하지 않고 사용해야 함.

---

### i18n 설계(Next.js)

- 요구사항: 쿼리 `?lang=kr|en`으로 초기 로케일 선택, 기본 `kr`
- 접근: 클라이언트 컴포넌트에서 `useSearchParams`로 lang 파싱 → 컨텍스트/전역 스토어에 설정
- 리소스: `src/locales/{kr,en}.json` 유지
- SSR 고려: 메타 타이틀/오픈그래프를 로케일별로 반영하려면 동적 메타 생성(`generateMetadata`)에서 lang 처리

---

### RSVP 메일 전송(API)

- SvelteKit 액션 → Next.js API Route로 이관
  - `src/app/api/rsvp/route.ts` (POST)
  - Body: `{ fullname: string, rsvp: 'yes'|'no' }`
  - 검증 실패 시 400 반환, 성공 시 `{ success: true }`
- Resend 연동
  - ENV: `RESEND_API_KEY`, `FROM_EMAIL`, `TO_EMAIL` (Netlify 환경변수)
  - 서버 전용: API Route 내부에서만 키 접근
- 전송 UX
  - 전송 중 버튼 비활성/로딩, 성공/오류 메시지 표시

---

### 섹션별 요구사항 매핑

- Cover: 날짜/장소 표시, 히어로 이미지/장식
- Letter: 서브타이틀/본문(줄바꿈 유지)
- Calendar: 결혼식 날짜 강조, 요일 아이콘(svg)
- RSVP: 폼 입력/검증, API 호출, 드레스코드/메뉴 아코디언
- Gallery: 썸네일 그리드, 확대 보기(모달/라이트박스), 접근성
- Location: 주소 표기/복사, 복사 성공 토스트

---

### 접근성/상태/성능

- 폼 에러의 ARIA 속성/포커스 관리
- 키보드 내비게이션
- 이미지 최적화: `next/image`, 적절한 사이즈/priority
- 메타/SEO: 로케일 메타 타이틀, `lang` 속성, 기본 OG 태그

---

### 파일/디렉터리 계획

- `src/locales/{kr,en}.json` 복사
- `public/`에 이미지/svg 복사
- `src/app/(sections)/*.tsx`로 UI 분해
- `src/app/api/rsvp/route.ts` 추가
- `src/styles/` 도입 시 `globals.css`에서 import

---

### ENV/설정

- Netlify 환경변수: `RESEND_API_KEY`, `FROM_EMAIL`, `TO_EMAIL`
- `netlify.toml`: 빌드/플러그인 이미 구성됨

---

### 작업 과정(워크플로우)

1. 소스 파악(Svelte)

- `src/components/*.svelte`(cover, letter, calendar, rsvp, gallery, location) 구조/프롭/이벤트 확인
- i18n 키 사용처(kr.json/en.json)와 포맷 파악
- 서버 액션(+page.server.ts)의 데이터/검증/응답 스키마 확인

2. 리소스/텍스트 이관

- `src/locales/{kr,en}.json` → Next `src/locales/`로 복사
- `src/lib/assets/**` → Next `public/**`로 복사(경로 스왑 점검)

3. i18n 컨텍스트 구축(Next)

- 클라이언트 컨텍스트/스토어 작성: `?lang`에서 초기값, `kr` 기본
- 텍스트 훅/헬퍼 준비: `t('path.to.key')` 형태 접근 보장
- `generateMetadata`에서 lang 반영(필요 시)

4. 섹션 단위 컴포넌트 변환

- Svelte 각 컴포넌트를 동일한 책임의 React 컴포넌트로 1:1 매핑
  - Cover.tsx, Letter.tsx, Calendar.tsx, Rsvp.tsx, Gallery.tsx, Location.tsx
- 스타일/마크업은 원형 유지하되 Next 관용구로 변환(`next/image`, aria, 키보드 포커스)

5. RSVP API 구현

- `src/app/api/rsvp/route.ts`에 POST 처리, 검증, Resend 호출
- 오류/성공 응답 포맷을 Svelte 액션과 일치시켜 프론트 변경 최소화

6. 페이지 조립

- `src/app/page.tsx`에서 섹션 순서대로 조합
- 로딩/에러/토스트 등 공통 UI 배치

7. 접근성/상태/성능 점검

- 폼 포커스 이동, aria-live, 키보드 탐색
- 이미지 사이즈/priority, 코드 스플리팅

8. 배포/환경 변수 설정

- Netlify에 ENV 세팅(Resend 키/이메일)
- 빌드/프리뷰 확인, 에러 로깅 점검

---

### i18n 컨텍스트 설계안(Next)

- 목적: Svelte의 `localeStore` 유사 기능을 Next에서 간단/명확하게 제공
- 구성 요소
  - `LangProvider`: `useSearchParams()`로 `lang` 파싱 → 상태 보관(`'kr' | 'en'`), 기본 `'kr'`
  - `useLang()`: 현재 언어/스위처 제공, `isKr`/`isEn` 파생 값
  - `useT()`: `src/locales`에서 키를 조회하는 번역 헬퍼(`t('rsvp.title')`)
- 동작
  - App 레이아웃에서 `LangProvider`로 감싸고, 섹션 컴포넌트들은 `useT()`로 문자열 조회
  - URL에 `?lang=` 변경 시 클라이언트에서 반영
- 메타 연동
  - `generateMetadata`에서 `headers()` 또는 searchParams로 lang 반영, 로케일 메타 타이틀 선택 적용

---

### Svelte → Next 컴포넌트 매핑 체크리스트

- [ ] `cover.svelte` → `Cover.tsx`
- [ ] `letter.svelte` → `Letter.tsx`
- [ ] `calendar.svelte` → `Calendar.tsx`
- [ ] `rsvp.svelte` + `rsvp-select.svelte` + `rsvp-accordion.svelte` → `Rsvp.tsx`(+ 서브 컴포넌트)
- [ ] `gallery.svelte` → `Gallery.tsx`
- [ ] `location.svelte` → `Location.tsx`
- [ ] `+page.server.ts` 액션 → `api/rsvp/route.ts`

---

### 체크리스트

- [ ] 로케일 리소스 복사 및 컨텍스트
- [ ] Cover/Letter/Calendar/RSVP/Gallery/Location 컴포넌트 작성
- [ ] RSVP API 라우트 구현 및 Resend 연동
- [ ] 전송 UX(로딩/오류/성공) 구현
- [ ] 이미지/자산 마이그레이션 완료
- [ ] 접근성 검토(ARIA/포커스)
- [ ] SEO/메타/`<html lang>` 반영
- [ ] Netlify ENV 설정 반영
