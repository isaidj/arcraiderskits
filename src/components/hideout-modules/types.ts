export interface HideoutModuleRequirement {
  itemId: string;
  quantity: number;
}

export interface HideoutModuleLevel {
  level: number;
  requirementItemIds: HideoutModuleRequirement[];
  otherRequirements?: string[];
  description?: string;
}

export interface HideoutModule {
  id: string;
  name: { [key: string]: string };
  maxLevel: number;
  levels: HideoutModuleLevel[];
}
