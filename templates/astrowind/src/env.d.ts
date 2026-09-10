declare module 'astrowind:config' {
  export const SITE: import('./integration/utils/configBuilder').SiteConfig;
  export const I18N: import('./integration/utils/configBuilder').I18NConfig;
  export const METADATA: import('./integration/utils/configBuilder').MetaDataConfig;
  export const APP_BLOG: import('./integration/utils/configBuilder').AppBlogConfig;
  export const UI: import('./integration/utils/configBuilder').UIConfig;
  export const ANALYTICS: import('./integration/utils/configBuilder').AnalyticsConfig;
}
