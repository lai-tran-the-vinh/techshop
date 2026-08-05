// Generated from create-user.dto.ts
export interface ChangePasswordInterface {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}
export interface UserInterface {
  name: string;
  branch: string;
  email: string;
  password: string;
  phone?: string;
  address?: string[];
  age?: number;
  refreshToken: string;
  avatar?: string;
  role?: string;
  status?: string;
}
export interface AddressInterface {
  specificAddress: string;
  addressDetail: string;
  default: boolean;
}
export interface RegisterUserInterface {
  name: string;
  password: string;
  email: string;
  addresses: AddressInterface[];
  phone?: string;
  age?: number;
  role: string[];
  gender?: string;
}
export interface LoginInterface {
  email: string;
  password: string;
}

// Generated from update-user.dto.ts
export interface UpdateUserInterface extends Partial<UserInterface> {}

// Generated from verify-otp.dto.ts
export interface VerifyOtpInterface {
  email: string;
  otp: string;
}
