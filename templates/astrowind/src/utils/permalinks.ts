import slugify from 'limax';
import {
  joinUrlPath,
  normalizePathTrailingSlash,
  trimSlashes,
} from '@webfactory/utilities';

import { SITE, APP_BLOG } from 'astrowind:config';

export const trimSlash = trimSlashes;
const createPath = (...params: string[]) =>
  normalizePathTrailingSlash(joinUrlPath(...params), SITE.trailingSlash);

const BASE_PATHNAME = SITE.base || '/';

export const cleanSlug = (text = '') =>
  trimSlash(text)
    .split('/')
    .map((slug) => slugify(slug))
    .join('/');

export const BLOG_BASE = cleanSlug(APP_BLOG?.list?.pathname);
export const CATEGORY_BASE = cleanSlug(APP_BLOG?.category?.pathname);
export const TAG_BASE = cleanSlug(APP_BLOG?.tag?.pathname) || 'tag';

export const POST_PERMALINK_PATTERN = trimSlash(
  APP_BLOG?.post?.permalink || `${BLOG_BASE}/%slug%`,
);

/** */
export const getCanonical = (path = ''): string | URL => {
  const url = new URL(path, SITE.site);
  url.pathname = normalizePathTrailingSlash(url.pathname, SITE.trailingSlash);
  return String(url);
};

/** */
export const getPermalink = (slug = '', type = 'page'): string => {
  let permalink: string;

  if (
    slug.startsWith('https://') ||
    slug.startsWith('http://') ||
    slug.startsWith('://') ||
    slug.startsWith('#') ||
    slug.startsWith('javascript:')
  ) {
    return slug;
  }

  switch (type) {
    case 'home':
      permalink = getHomePermalink();
      break;

    case 'blog':
      permalink = getBlogPermalink();
      break;

    case 'asset':
      permalink = getAsset(slug);
      break;

    case 'category':
      permalink = createPath(CATEGORY_BASE, trimSlash(slug));
      break;

    case 'tag':
      permalink = createPath(TAG_BASE, trimSlash(slug));
      break;

    case 'post':
      permalink = createPath(trimSlash(slug));
      break;

    case 'page':
    default:
      permalink = createPath(slug);
      break;
  }

  return definitivePermalink(permalink);
};

/** */
export const getHomePermalink = (): string => getPermalink('/');

/** */
export const getBlogPermalink = (): string => getPermalink(BLOG_BASE);

/** */
export const getAsset = (path: string): string =>
  joinUrlPath(BASE_PATHNAME, path);

/** */
const definitivePermalink = (permalink: string): string =>
  createPath(BASE_PATHNAME, permalink);
