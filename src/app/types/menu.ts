export interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  active: boolean;
}

export interface SiteProfile {
  logo: string;
}
