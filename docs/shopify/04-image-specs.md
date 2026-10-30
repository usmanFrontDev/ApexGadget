# 04 — Image specs

Current bundled images (actual files in `src/assets/images`) are the baseline ratios; replacements keep the same
ratio so the absolute positioning in the promo cards still works. Upload ~2× the rendered size for retina; the Shopify CDN
resizes on request.

| Use | Where it lives | Ratio (W:H) | Upload size | Format | Max weight | Notes |
|---|---|---|---|---|---|---|
| Hero phones | `apex_hero.image` | 872:1015 | 1000×1164 | PNG/WebP, transparent bg | 400 KB | subject centred, ~8% safe margin, soft shadow baked in |
| Promo: trade-in | `apex_promo_card.image` | 500:601 | 800×962 | PNG/WebP, transparent | 300 KB | hand + phone, keep the same crop as today |
| Promo: accessories | `apex_promo_card.image` | 600:710 | 960×1136 | PNG/WebP, transparent | 350 KB | overflows card top by design (−7.4%) |
| Category card | `apex_category_card.image` | 1:1 | 480×480 | PNG/WebP, transparent | 120 KB | one subject, centred |
| Home banner slide | `apex_banner_slide.image` | 1400:592 (≈2.36:1) | 2800×1184 | JPG/WebP | 300 KB | on phones the frame is 4:3 and crops with `object-position: 62% center`, keep the focal subject right of centre |
| Shop banner | `apex_site_settings.shop_banner_image` | 8:3 | 2880×1080 | JPG/WebP | 300 KB | text is baked into the image today; keep copy ≤ 40% of the width |
| Product (card + PDP) | product media | 1:1 | 1600×1600 (min 1000) | JPG/WebP | 250 KB | neutral/white or transparent bg, device centred; 4–8 per product, first = hero |
| Collection | collection image | 1:1 | 800×800 | JPG/WebP | 150 KB | optional |
| Logo | code asset | 162×64 (current) | SVG preferred | SVG | 10 KB | stays in repo |

## Shopify CDN transforms
Storefront API `Image.url(transform: …)` accepts `maxWidth`, `maxHeight`, `crop` (`CENTER|TOP|BOTTOM|LEFT|RIGHT`),
`scale`, `preferredContentType` (`WEBP`/`JPG`/`PNG`). Examples used by the app:

- Product card: `url(transform: { maxWidth: 640, preferredContentType: WEBP })`
- PDP gallery: `maxWidth: 1200`; thumbnails `maxWidth: 160`
- Hero: `maxWidth: 1000`; promo: `maxWidth: 800`; banners: `maxWidth: 2000` (desktop) — use the plain `url` with `?width=` for `srcset` (`…jpg?width=800 800w, …?width=1600 1600w`). (`?width=` on cdn.shopify.com URLs is widely used; ⚠ UNVERIFIED in the current docs.)

Always send `width`/`height` from the API (`Image.width/height`) to avoid layout shift. Hero and the first banner are `loading="eager"`, everything else lazy.

## Page banners (Trade-In, Favorites)

| File | Size | Ratio | Notes |
|---|---|---|---|
| `src/assets/images/TradeInBanner.png` | 2172 × 724 px, PNG **RGB (no transparency)**, ~1.5 MB | 3:1 (3.0) | dark red scene, phones on the right (x ≈ 60–85 %); headline, lead and the 3 steps are **baked into the picture** |
| `src/assets/images/FavBanner.png` | 2172 × 724 px, PNG RGB, ~1.6 MB | 3:1 | light scene, red + titanium phones at x ≈ 54–83 %; headline "Save what you love. Find it anytime." and a "Your favorites" chip are baked in |

Rules: shown in full from `lg` (page copy is also in the DOM as visually hidden text); below `lg` the page writes real HTML copy and shows a **4:3 crop** of the phones (`object-position` 90 % / 84 %), so keep the phones inside x 50–90 % and the baked text left of x 45 %. Keep the 3:1 ratio when replacing the files. For real, editable HTML copy on desktop too, export **text-free** versions (same size). Both files are heavy for web: re-export as WebP/JPG under ~300 KB.
CtaBanner art (red phone, optional): not supplied yet, suggested `src/assets/images/CtaBanner.png`, transparent PNG ≈ 400 × 400 px.
