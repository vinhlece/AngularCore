export interface Model {
  status?: string;
}

export interface ColorPalette {
  name?: string;
  id?: string;
  colors?: string[];
  userId?: string;
  threshold?: string[];
  headerFont?: HeaderFont;
}

export interface HeaderFont {
  fontFamily?: string;
  fontSize?: number;
}

export interface Role {
  id: string;
  name: string;
}

export interface InstanceColor {
  name: string;
  color: string;
}
