export type Subjects = string;
export type Actions = string;
// Generated from create-permission.dto.ts
export interface PermissionInterface {
  name: string;
  description: string;
  module: Subjects;
  action: Actions;
  isActive: boolean;
}

// Generated from update-permission.dto.ts
export interface UpdatePermissionInterface extends Partial<PermissionInterface> {}
