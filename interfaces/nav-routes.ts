export interface NavRoutes {
  id: string;
  name: string;
  href: string;
  dropdownMenu?: NavRoutes[];
}
