// Generated from create-comment.dto.ts
export interface CommentInterface {
  userId: string;
  userName: string;
  content: string;
  productId: string;
  rating?: number;
}
export interface ReplyInterface {
  userId: string;
  userName: string;
  content: string;
}

// Generated from create-product.dto.ts
export interface VariantColorInterface {
  colorName: string;
  colorHex: string;
  images?: string[];
}
export interface VariantInterface {
  name: string;
  price: number;
  memory: {
    ram: string;
    storage: string;
  };
  color: VariantColorInterface[];
  isActive?: boolean;
}
export interface ProductInterface {
  name: string;
  description?: string;
  galleryImages?: string[];
  slug?: string;
  // @IsArray()
  // @IsOptional()
  // @IsString({ each: true })
  // promotions?: string[];
  // @IsArray()
  // @IsOptional()
  // @IsString({ each: true })
  // warranties?: string[];
  category: string;
  brand: string;
  variants?: VariantInterface[];
  discount: number;
  attributes?: Record<string, any>;
  // @IsArray()
  // @IsOptional()
  // @IsString({ each: true })
  // tags?: string[];
  viewCount?: number;
  averageRating?: number;
  reviewCount?: number;
  isActive?: boolean;
  isFeatured?: boolean;
}

// Generated from update-product.dto.ts
export interface UpdateProductInterface extends Partial<ProductInterface> {}
