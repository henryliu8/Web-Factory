import Hero from "./sections/Hero.astro";
import Stats from "./sections/Stats.astro";
import CardGrid from "./sections/CardGrid.astro";
import Split from "./sections/Split.astro";
import CTA from "./sections/CTA.astro";
import FAQ from "./sections/FAQ.astro";
import ProfileBio from "./sections/ProfileBio.astro";
import Timeline from "./sections/Timeline.astro";
import Contact from "./sections/Contact.astro";
import Location from "./sections/Location.astro";
import Header from "./components/Header.astro";
import Footer from "./components/Footer.astro";
import {
  HeroFullscreen,
  FeatureGrid,
  CTA as SharedCTA,
} from "@webfactory/sections";
export const sharedSections = {
  "hero/HeroFullscreen": HeroFullscreen,
  "features/FeatureGrid": FeatureGrid,
  "cta/CTA": SharedCTA,
};
export const templateComponents = {
  "navigation/Header": Header,
  "navigation/Footer": Footer,
};
export const templateSections = {
  "clinic/Hero": Hero,
  "clinic/Stats": Stats,
  "clinic/CardGrid": CardGrid,
  "clinic/Split": Split,
  "clinic/CTA": CTA,
  "clinic/FAQ": FAQ,
  "clinic/ProfileBio": ProfileBio,
  "clinic/Timeline": Timeline,
  "clinic/Contact": Contact,
  "clinic/Location": Location,
};
