export interface Bot {
  id: string;
  name: string;
  image: string;
  type: string;
  threat: string;
  description: string;
  weakness?: string;
  maps?: string[];
  destroyXp: number;
  lootXp: number;
  drops: string[];
}

export interface ThreatColors {
  bg: string;
  border: string;
  text: string;
  glow: string;
  gradient: string;
  shadow: string;
  color: string;
}
