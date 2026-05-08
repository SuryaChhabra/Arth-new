# Festival hero illustration

The homepage uses an illustrated nighttime festival scene as its hero.

The component looks for the image at:

```
public/festival-hero.png
```

If the PNG is missing, it automatically falls back to the SVG placeholder
at `public/festival-hero.svg` so the page still renders. **Replace
`festival-hero.png` with the high-res illustrated reference image** to
get the full premium look.

## Image expectations

- Recommended aspect ratio: **3:2** (e.g. 1536 x 1024 or 2400 x 1600).
- Format: PNG or JPG (PNG preferred for crisp lines + transparency).
- Composition: nighttime women's wellness festival — central live stage,
  5 booths arranged around it (top-center, top-left, top-right,
  bottom-left, bottom-right), warm string lights, lounge seating,
  food cart, planters, women gathered.

## Booth hotspot positions

The 5 clickable booth hotspots are placed in `lib/festivalBooths.js`
as percentages of the illustration. Update those `hotspot.x` /
`hotspot.y` values if your replacement image puts booths in different
spots:

| Booth | x | y |
|---|---|---|
| So Jao Lounge | 50% | 22% |
| Brain Fog Booth | 17% | 30% |
| Hot Flash Chill Room | 84% | 30% |
| Normal? Ya Normalized? Wall | 18% | 60% |
| Iron Energy Bar | 84% | 62% |
