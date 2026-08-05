// Generated from create-role.dto.ts
export interface RoleInterface {
  name: string;
  description?: string;
  permissions?: string[];
  createdAt?: Date;
  updatedAt?: Date;
}

// Generated from update-role.dto.ts
export interface UpdateRoleInterface extends Partial<RoleInterface> {}
