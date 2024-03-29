export type Camp = {
  id: string;
  name: string;
  from: Date;
  until: Date;
  theme: string;
  subTheme: string;
  tax: number;
  isActive: boolean;
  folderUrl?: string;
};