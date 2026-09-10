import { getImage } from 'astro:assets';
import type { ImageMetadata } from 'astro';
import type { MetaDataOpenGraph } from '@webfactory/template-astrowind/types';

/**
 * Resolve an image reference to either ImageMetadata (local) or a string URL (remote/public).
 * Accepts:
 *   - `null` / `undefined`         → returned as-is
 *   - `ImageMetadata`              → returned as-is (imported by the project)
 *   - `"http(s)://…"` or `"/path"` → returned as-is (external or public/)
 *
 * Project source assets must be imported by the consuming project and passed
 * as `ImageMetadata`. A template package cannot use `import.meta.glob()` to
 * scan the consuming application's filesystem.
 */
export const findImage = async (
  imagePath?: string | ImageMetadata | null
): Promise<string | ImageMetadata | undefined | null> => {
  return imagePath;
};

const OG_WIDTH = 1200;
const OG_HEIGHT = 626;

/**
 * Adapt OpenGraph images to absolute, optimized URLs.
 * Used by Metadata.astro to produce social-card-ready URLs.
 */
export const adaptOpenGraphImages = async (
  openGraph: MetaDataOpenGraph = {},
  astroSite: URL | undefined = new URL('')
): Promise<MetaDataOpenGraph> => {
  if (!openGraph?.images?.length) return openGraph;

  const adaptedImages = await Promise.all(
    openGraph.images.map(async (image) => {
      if (!image?.url) return { url: '' };

      const resolved = await findImage(image.url);
      if (!resolved) return { url: '' };

      // Generate an optimized JPG via Astro's image service (Sharp by default).
      const optimized = await getImage({
        src: resolved,
        width: OG_WIDTH,
        height: OG_HEIGHT,
        format: 'jpg',
      });

      return {
        url: String(new URL(optimized.src, astroSite)),
        width: Number(optimized.attributes.width) || OG_WIDTH,
        height: Number(optimized.attributes.height) || OG_HEIGHT,
      };
    })
  );

  return { ...openGraph, images: adaptedImages };
};
