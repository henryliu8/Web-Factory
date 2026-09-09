export interface ContainerProps {
  as?: 'div' | 'section' | 'header' | 'footer' | 'main';
  width?: 'default' | 'wide' | 'narrow' | 'full';
  class?: string;
}

export interface ButtonProps {
  href?: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  class?: string;
}
