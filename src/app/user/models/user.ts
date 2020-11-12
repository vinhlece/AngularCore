export interface User {
  username?: string;
  Session?: string;
  id: string;
  displayName: string;
  roles?: string[];
  selectedPalette?: string;
  token?: string;
  password: string;
  isActive?: boolean;
}

export interface Credentials {
  userName: string;
  password: string;
}

export interface Role {
  id: string;
  name: string;
}

