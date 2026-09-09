export interface Link {
  label: string;
  href: string;
  external?: boolean;
}

export interface ActionLink extends Link {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
}

export interface NavigationItem extends Link {
  children?: NavigationItem[];
}

export interface ImageSource {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface MediaSource extends ImageSource {
  position?: string;
}

export interface SectionContainerProps {
  class?: string;
  id?: string;
}
