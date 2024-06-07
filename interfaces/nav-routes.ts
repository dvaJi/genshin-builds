export interface NavRoutes {
  id: string;
  name: string;
  href?: string;
  children?: NavRoutes[];
  icon?: JSX.Element;
  isNew?: boolean;
}
