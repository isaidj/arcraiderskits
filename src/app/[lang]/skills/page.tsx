// import { promises as fs } from "fs";
// import path from "path";

// interface SkillNode {
//   id: string;
//   name: string;
//   description?: string;
//   category?: string;
//   requirements?: any;
//   effects?: any;
//   [key: string]: any;
// }

// async function getSkillNodes(): Promise<SkillNode[]> {
//   try {
//     const filePath = path.join(process.cwd(), "public", "data", "skillNodes.json");
//     const fileContents = await fs.readFile(filePath, "utf8");
//     return JSON.parse(fileContents);
//   } catch (error) {
//     console.error("Error loading skill nodes:", error);
//     return [];
//   }
// }

// export default async function SkillsPage() {
//   const skills = await getSkillNodes();

//   return (
//     <>
//       <main className="min-h-screen pt-32 pb-20 px-4">
//         <div className="container mx-auto max-w-7xl">
//           <div className="text-center mb-12">
//             <h1 className="text-5xl font-bold text-[#00ffff] mb-4">🌳 Skill Tree</h1>
//             <p className="text-gray-400 text-lg">Unlock and upgrade your skills</p>
//             <p className="text-sm text-gray-500 mt-2">Total Skill Nodes: {skills.length}</p>
//           </div>

//           {skills.length === 0 ? (
//             <div className="text-center py-20">
//               <p className="text-gray-400 text-xl mb-4">No skill nodes data available yet.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {skills.map((skill, index) => (
//                 <div
//                   key={`${skill.id}-${index}`}
//                   className="bg-black/50 border border-[#00ffff]/30 rounded-lg p-6 hover:border-[#00ffff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
//                 >
//                   <div className="mb-3">
//                     <h3 className="text-xl font-bold text-[#00ffff] mb-2">{skill.name || "Unknown Skill"}</h3>
//                     {skill.category && <span className="inline-block bg-[#00ffff]/20 text-[#00ffff] px-3 py-1 rounded text-sm">{skill.category}</span>}
//                   </div>

//                   {skill.description && <p className="text-gray-300 mb-4">{skill.description}</p>}

//                   {skill.effects && (
//                     <div className="mb-4">
//                       <h4 className="text-sm font-semibold text-[#00ffff] mb-2">Effects:</h4>
//                       <div className="text-sm text-gray-300 bg-gray-900 p-3 rounded">
//                         {typeof skill.effects === "string" ? <p>{skill.effects}</p> : <pre className="overflow-x-auto">{JSON.stringify(skill.effects, null, 2)}</pre>}
//                       </div>
//                     </div>
//                   )}

//                   {skill.requirements && (
//                     <div className="mt-4 pt-4 border-t border-[#00ffff]/20">
//                       <h4 className="text-sm font-semibold text-[#00ffff] mb-2">Requirements:</h4>
//                       <div className="text-sm text-gray-300 bg-gray-900 p-2 rounded">
//                         {typeof skill.requirements === "string" ? (
//                           <p>{skill.requirements}</p>
//                         ) : (
//                           <pre className="overflow-x-auto">{JSON.stringify(skill.requirements, null, 2)}</pre>
//                         )}
//                       </div>
//                     </div>
//                   )}
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </main>
//     </>
//   );
// }

export default async function SkillsPage() {
  return <></>;
}
