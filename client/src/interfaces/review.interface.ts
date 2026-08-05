// Generated from create-review.dto.ts
export interface ReviewInterface {
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

// Generated from update-review.dto.ts
export interface UpdateReviewInterface extends Partial<ReviewInterface> {}
