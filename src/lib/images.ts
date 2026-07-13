import type { ImageMetadata } from 'astro';

// Central image resolver — the single bridge between the string paths still used
// in the data files (work.js, and the arrays inside Services/Testimonials/etc.)
// and Astro's build-time image optimiser (`astro:assets`).
//
// WHY: images now live in src/assets/img (NOT /public), so Astro runs each one
// through sharp at build time and emits responsive, modern-format (WebP) files.
// `<Image>`/`<Picture>` need an imported `ImageMetadata` object, not a string —
// this glob imports every asset once (eagerly, at build) and hands back the
// right object for a given reference.
//
// FUTURE-PROOF / swapping photos:
//   • Replace a photo → drop the new file into src/assets/img using the SAME
//     filename. Next build re-optimises it automatically. Nothing else to touch.
//   • Add a new photo → drop the file in src/assets/img and reference it by its
//     public-style path ('/img/my-new-photo.jpg') anywhere in the data.
//   • A typo or missing file throws a LOUD build error (below) instead of
//     silently shipping a broken <img>.
const images = import.meta.glob<{ default: ImageMetadata }>(
  '/src/assets/img/**/*.{jpg,jpeg,png,webp,avif}',
  { eager: true }
);

/**
 * Resolve a data-file image reference to its optimisable ImageMetadata.
 * Accepts legacy public-style paths ('/img/portfolio-01.jpg',
 * '/img/logos/cinex.png') or a bare filename ('portfolio-01.jpg').
 */
export function getLocalImage(ref: string): ImageMetadata {
  const clean = ref.replace(/^\/+/, '').replace(/^img\//, '');
  const key = `/src/assets/img/${clean}`;
  const mod = images[key];
  if (!mod) {
    throw new Error(
      `[images] No asset found for "${ref}" (looked up "${key}"). ` +
        `Add the file to src/assets/img/ or fix the reference.`
    );
  }
  return mod.default;
}
