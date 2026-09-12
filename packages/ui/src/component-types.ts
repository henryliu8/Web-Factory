export interface ContainerProps {
  as?: "div" | "section" | "header" | "footer" | "main";
  width?: "default" | "wide" | "narrow" | "full";
  class?: string;
}

export interface ButtonProps {
  href?: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  class?: string;
}

export interface BadgeProps {
  tone?: "neutral" | "primary" | "success" | "warning" | "error";
  size?: "sm" | "md";
  class?: string;
}

export interface CardProps {
  as?: "article" | "div" | "section" | "li";
  variant?: "bordered" | "elevated" | "subtle";
  padding?: "sm" | "md" | "lg";
  class?: string;
}

export interface CalloutProps {
  title?: string;
  tone?: "info" | "success" | "warning" | "error";
  class?: string;
}
