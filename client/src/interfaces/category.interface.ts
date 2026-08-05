// Generated from create-category.dto.ts
export interface CategoryInterface {
  name: string;
  description?: string;
  logo?: string;
  slug: string;
  configFields?: Record<string, any>;
  isActive?: boolean;
}

// Generated from update-category.dto.ts
export interface UpdateCategoryInterface extends Partial<CategoryInterface> {}
