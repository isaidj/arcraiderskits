import { promises as fs } from "fs";
import path from "path";

interface Quest {
  id: string;
  name: string;
  description?: string;
  objectives?: string[];
  rewards?: any;
  [key: string]: any;
}

async function getQuests(): Promise<Quest[]> {
  try {
    const filePath = path.join(process.cwd(), "public", "data", "quests.json");
    const fileContents = await fs.readFile(filePath, "utf8");
    return JSON.parse(fileContents);
  } catch (error) {
    console.error("Error loading quests:", error);
    return [];
  }
}

export default async function QuestsPage() {
  const quests = await getQuests();

  return (
    <>
      <main className="min-h-screen pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-7xl">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-[#00ffff] mb-4">📜 Quests & Missions</h1>
            <p className="text-gray-400 text-lg">Complete quests and earn rewards</p>
            <p className="text-sm text-gray-500 mt-2">Total Quests: {quests.length}</p>
          </div>

          {quests.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-xl mb-4">No quests data available yet.</p>
          
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {quests.map((quest, index) => (
                <div
                  key={`${quest.id}-${index}`}
                  className="bg-black/50 border border-[#00ffff]/30 rounded-lg p-6 hover:border-[#00ffff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
                >
                  <h3 className="text-2xl font-bold text-[#00ffff] mb-3">{quest.name || "Unknown Quest"}</h3>

                  {quest.description && <p className="text-gray-300 mb-4">{quest.description}</p>}

                  {quest.objectives && quest.objectives.length > 0 && (
                    <div className="mb-4">
                      <h4 className="text-lg font-semibold text-[#00ffff] mb-2">Objectives:</h4>
                      <ul className="list-disc list-inside space-y-1 text-gray-300">
                        {quest.objectives.map((obj: string, idx: number) => (
                          <li key={idx}>{obj}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {quest.rewards && (
                    <div className="mt-4 pt-4 border-t border-[#00ffff]/20">
                      <h4 className="text-lg font-semibold text-[#00ffff] mb-2">Rewards:</h4>
                      <div className="text-gray-300">
                        {typeof quest.rewards === "string" ? (
                          <p>{quest.rewards}</p>
                        ) : (
                          <pre className="text-sm bg-gray-900 p-2 rounded overflow-x-auto">{JSON.stringify(quest.rewards, null, 2)}</pre>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
