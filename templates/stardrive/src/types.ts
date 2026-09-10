import type {
  ActionLink,
  ImageSource,
  NavigationItem,
  ResolvedSectionRegistry,
} from "@webfactory/core";

export interface PageMetadata {
  title: string;
  description?: string;
  lang?: string;
}

export interface HeaderData {
  brand?: string;
  logo?: ImageSource;
  items?: NavigationItem[];
  cta?: ActionLink;
}

export interface HeroData {
  eyebrow?: string;
  title: string;
  description?: string;
  image?: ImageSource | string;
  primaryAction?: ActionLink;
  secondaryAction?: ActionLink;
  align?: "start" | "center" | "end";
}

export interface FeatureItem {
  title: string;
  description: string;
  icon?: string;
  href?: string;
}

export interface FeaturesData {
  title?: string;
  intro?: string;
  items: FeatureItem[];
}

export interface CTAData {
  eyebrow?: string;
  title: string;
  description?: string;
  primaryAction?: ActionLink;
  secondaryAction?: ActionLink;
}

export interface HomeTemplateProps {
  metadata: PageMetadata;
  header: HeaderData;
  hero: HeroData;
  features?: FeaturesData;
  cta?: CTAData;
  sectionRegistry?: ResolvedSectionRegistry;
  class?: string;
}

export interface StandardPageTemplateProps {
  metadata: PageMetadata;
  header: HeaderData;
  heading: string;
  intro?: string;
  cta?: CTAData;
  class?: string;
}
