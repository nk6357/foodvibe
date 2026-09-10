export type RgbColor = [number, number, number];

export type CardStyle = "rounded" | "sharp";
export type ImageStyle = "cover" | "contain";
export type Density = "compact" | "comfortable" | "spacious";
export type SocialLinkType =
  "telegram" | "whatsapp" | "instagram" | "vk" | "website" | "other";

export interface SocialLink {
  type: SocialLinkType;
  label: string;
  url: string;
}

export interface RestaurantInfo {
  name: string;
  shortDescription?: string;
  description?: string;
  currency: string;
  locale: string;
  timeZone: string;
  phone?: string;
  email?: string;
  address?: string;
  workingHours?: string;
  mapUrl?: string;
  socialLinks: SocialLink[];
}

export interface ThemeConfig {
  accent: RgbColor;
  background: RgbColor;
  cardStyle: CardStyle;
  imageStyle: ImageStyle;
  density: Density;
}

export interface FeaturesConfig {
  search: boolean;
  categoryNavigation: boolean;
  dishModal: boolean;
  contacts: boolean;
  downloadableMenu: boolean;
  showDescriptions: boolean;
  showWeights: boolean;
  showLabels: boolean;
  showAllergens: boolean;
  showSpiceLevel: boolean;
  showUnavailableItems: boolean;
}

export interface LegalConfig {
  enabled: boolean;
  version?: string;
  organizationName?: string;
  privacyEmail?: string;
  offerDocument?: string;
  privacyDocument?: string;
  cookieNotice?: CookieNoticeConfig;
}

export interface CookieNoticeConfig {
  enabled: boolean;
  text: string;
  buttonLabel: string;
  privacyLinkLabel?: string;
}

export interface SeoConfig {
  index: boolean;
  title: string | null;
  description: string | null;
}

export interface DownloadItem {
  id: string;
  title: string;
  description?: string;
  file: string;
}

export interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  oldPrice: number | null;
  weight?: string;
  labels: string[];
  allergens: string[];
  spiceLevel: number;
  available: boolean;
  hasImage: boolean;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  items: MenuItem[];
}

export interface MenuData {
  schemaVersion: number;
  restaurant: RestaurantInfo;
  theme: ThemeConfig;
  features: FeaturesConfig;
  legal: LegalConfig;
  seo: SeoConfig;
  downloads: DownloadItem[];
  categories: MenuCategory[];
}

export interface FlatMenuItem extends MenuItem {
  categoryId: string;
  categoryName: string;
}
