export interface NavRoutes {
  id: string;
  name: string;
  href?: string;
  children?: NavRoutes[];
  icon?: React.ReactNode;
  isNew?: boolean;
}
