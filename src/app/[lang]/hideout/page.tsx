// import { promises as fs } from "fs";
// import path from "path";

// interface HideoutModule {
//   id: string;
//   name: string;
//   description?: string;
//   level?: number;
//   cost?: any;
//   [key: string]: any;
// }

// async function getHideoutModules(): Promise<HideoutModule[]> {
//   try {
//     const filePath = path.join(process.cwd(), "public", "data", "hideoutModules.json");
//     const fileContents = await fs.readFile(filePath, "utf8");
//     return JSON.parse(fileContents);
//   } catch (error) {
//     console.error("Error loading hideout modules:", error);
//     return [];
//   }
// }

// export default async function HideoutPage() {
//   const modules = await getHideoutModules();

//   return (
//     <>
//       <main className="min-h-screen pt-32 pb-20 px-4">
//         <div className="container mx-auto max-w-7xl">
//           <div className="text-center mb-12">
//             <h1 className="text-5xl font-bold text-[#00ffff] mb-4">Hideout Modules</h1>
//             <p className="text-gray-400 text-lg">Upgrade your hideout with these modules</p>
//             <p className="text-sm text-gray-500 mt-2">Total Modules: {modules.length}</p>
//           </div>

//           {modules.length === 0 ? (
//             <div className="text-center py-20">
//               <p className="text-gray-400 text-xl mb-4">No hideout modules data available yet.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//               {modules.map((module, index) => (
//                 <div
//                   key={`${module.id}-${index}`}
//                   className="bg-[#0d111d]/50 backdrop-blur-sm border  rounded-lg p-6 hover:border-[#00ffff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
//                 >
//                   <div className="flex items-start justify-between mb-3">
//                     <h3 className="text-xl font-bold text-[#00ffff]">{module.name || "Unknown Module"}</h3>
//                     {module.level && <span className="bg-[#00ffff]/20 text-[#00ffff] px-3 py-1 rounded-full text-sm font-semibold">Lv {module.level}</span>}
//                   </div>

//                   {module.description && <p className="text-gray-300 mb-4">{module.description}</p>}

//                   {module.cost && (
//                     <div className="mt-4 pt-4 border-t border-[#00ffff]/20">
//                       <h4 className="text-sm font-semibold text-[#00ffff] mb-2">Cost:</h4>
//                       <div className="text-sm text-gray-300 bg-gray-900 p-2 rounded">
//                         {typeof module.cost === "string" ? <p>{module.cost}</p> : <pre className="overflow-x-auto">{JSON.stringify(module.cost, null, 2)}</pre>}
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

export default async function HideoutPage() {
  return <></>;
}
