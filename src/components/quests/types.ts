export interface MultiLangText {
  en: string;
  de?: string;
  fr?: string;
  es?: string;
  pt?: string;
  pl?: string;
  no?: string;
  da?: string;
  it?: string;
  uk?: string;
  kr?: string;
  ru?: string;
  "zh-CN"?: string;
  ja?: string;
  tr?: string;
  "zh-TW"?: string;
  sr?: string;
  hr?: string;
}

export interface QuestObjective {
  en: string;
  de?: string;
  fr?: string;
  es?: string;
  pt?: string;
  pl?: string;
  no?: string;
  da?: string;
  it?: string;
  uk?: string;
  kr?: string;
  ru?: string;
  "zh-CN"?: string;
  ja?: string;
  tr?: string;
  "zh-TW"?: string;
  sr?: string;
  hr?: string;
}

export interface QuestItem {
  itemId: string;
  quantity: number;
}

export interface Quest {
  id: string;
  updatedAt: string;
  name: MultiLangText;
  trader: string;
  description?: MultiLangText;
  objectives?: QuestObjective[];
  requiredItemIds?: QuestItem[];
  grantedItemIds?: QuestItem[];
  rewardItemIds?: QuestItem[];
  xp: number;
  previousQuestIds: string[];
  nextQuestIds: string[];
  videoUrl?: string;
  map?: string;
  tips?: string[];
}

export type TraderType = "Shani" | "Celeste" | "Tian Wen" | "Apollo" | "All";
