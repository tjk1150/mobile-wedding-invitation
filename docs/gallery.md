## Gallery Lightbox Integration (PhotoSwipe) — Work List

- **Target**: Apply PhotoSwipe used in `our-wedding-invitation/src/components/gallery.svelte` to `mobile-wedding-invitation/src/sections/Gallery.tsx`.
- **Goal**: Clicking a gallery thumbnail opens a PhotoSwipe lightbox (no page navigation), supports swipe/keyboard, and displays the full-size image.

### Dependencies
- **Library**: `photoswipe` (v5+)
- **Install** (do not run yet; for reference):
```bash
cd /Users/jangjintae/Documents/project/codes/work/mobile-wedding-invitation
npm i photoswipe
```
- **CSS**: `photoswipe/style.css`
- **CSP note**: No external domains required; existing global security headers should remain compatible [[memory:9559258]].

### Implementation Checklist
- [ ] **Prepare data**: Ensure each image used in `Gallery.tsx` has known `width` and `height` for the large image. Options:
  - Map `image1.webp`…`image31.webp` to their intrinsic sizes (recommended for correct zoom/ratio), or
  - Use best-guess defaults for any unknowns, then refine.
- [ ] **Update markup** in `src/sections/Gallery.tsx`:
  - Keep anchors `<a>` wrapping thumbnails with `href` pointing to the large image (already present).
  - Add `data-pswp-width` and `data-pswp-height` to each anchor.
  - Keep `class="slide"` and container `id="gallery"` to match the Svelte structure for easy targeting.
- [ ] **Initialize PhotoSwipe** in `Gallery.tsx`:
  - Mark component with `'use client'` (already present).
  - Import: `PhotoSwipeLightbox` and CSS `photoswipe/style.css`.
  - Initialize inside `useEffect` with options similar to Svelte:
    - `gallery: '#gallery'`, `children: 'a'`
    - `showHideAnimationType: 'fade'`
    - `pswpModule: () => import('photoswipe')` (lazy import to avoid SSR issues)
  - Cleanup on unmount: `lightbox.destroy()`.
- [ ] **A11y**:
  - Provide meaningful `alt` text for thumbnails where possible.
  - Verify focus trap and ESC key to close lightbox.
- [ ] **Styles**:
  - Ensure existing gallery grid remains unchanged.
  - Confirm lightbox overlay appears above other elements (z-index, no conflicts).
- [ ] **Performance**:
  - Thumbnails continue to use `next/image` for optimization.
  - Large images are served from `/public/gallery/*.webp` (same domain).
- [ ] **CSP/Headers**:
  - Verify lightbox works under current CSP/security headers; no external image/CDN usage expected [[memory:9559258]].
- [ ] **QA**:
  - Click each thumbnail: opens PhotoSwipe instead of a new tab.
  - Swipe/keyboard navigation works.
  - Zoom gestures work on mobile.
  - Close X and overlay click close the lightbox.
  - No client errors in console.

### Example Edits (for reference)

- Import and init (inside `src/sections/Gallery.tsx`):
```tsx
'use client';
import { useEffect } from 'react';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

useEffect(() => {
  const lightbox = new PhotoSwipeLightbox({
    gallery: '#gallery',
    children: 'a',
    showHideAnimationType: 'fade',
    pswpModule: () => import('photoswipe'),
  });
  lightbox.init();
  return () => lightbox.destroy();
}, []);
```

- Anchor markup with size data (within the map):
```tsx
<a
  className="slide aspect-auto"
  href={`/gallery/image${p}.webp`}
  data-pswp-width={photoWidth}
  data-pswp-height={photoHeight}
>
  {/* next/image thumbnail */}
</a>
```

### Acceptance Criteria
- **Behavior**: Clicking any gallery image opens PhotoSwipe overlay (no navigation), supports swipe/keyboard/zoom.
- **Visual**: Overlay theme matches default PhotoSwipe; gallery layout unchanged.
- **Tech**: No SSR warnings, no runtime errors, and no CSP violations.

### Rollback Plan
- Remove PhotoSwipe imports and `useEffect` initialization from `Gallery.tsx`.
- Remove data attributes from anchors.
- Uninstall dependency:
```bash
npm uninstall photoswipe
```
