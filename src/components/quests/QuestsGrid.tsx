import { Quest } from "./types";
import { Locale } from "@/config/i18n";
import QuestCard from "./QuestCard";

interface QuestsGridProps {
  quests: Quest[];
  lang?: Locale;
}

export default function QuestsGrid({ quests, lang }: QuestsGridProps) {
  if (quests.length === 0) {
    return (
      <div className="text-center py-20">
        <div className="text-6xl mb-4">🔍</div>
        <p className="text-gray-400 text-xl mb-2">No quests found</p>
        <p className="text-gray-500 text-sm">Try adjusting your filters</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {quests.map((quest) => (
        <QuestCard key={quest.id} quest={quest} lang={lang} />
      ))}
    </div>
  );
}
