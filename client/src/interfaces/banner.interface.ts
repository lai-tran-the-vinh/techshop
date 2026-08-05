// Generated from create-banner.dto.ts
export interface BannerInterface {
  title: string;
  description: string;
  imageUrl: string;
  linkTo: string;
  position: string;
  clicks: number;
  views: number;
  isActive: boolean;
  startDate: Date;
  endDate: Date;
}

// Generated from update-banner.dto.ts
export interface UpdateBannerInterface extends Partial<BannerInterface> {}
