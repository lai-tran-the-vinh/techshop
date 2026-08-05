// Generated from create-branch.dto.ts
export interface LocationInterface {
  longitude: number;
  latitude: number;
}
export interface BranchInterface {
  name: string;
  address: string;
  phone: string;
  location: LocationInterface;
  email: string;
  isActive?: boolean;
}

// Generated from update-branch.dto.ts
export interface UpdateBranchInterface extends Partial<BranchInterface> {}
