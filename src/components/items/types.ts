export interface Item {
  id: string;
  name: string | { [key: string]: string };
  description?: string | { [key: string]: string };
  category?: string;
  type?: string;
  rarity?: string;
  image?: string;
  imageFilename?: string;
  [key: string]: any;
}

export interface RarityColors {
  border: string;
  shadow: string;
  glow: string;
  bg: string;
  color: string;
  gradient: string;
}
