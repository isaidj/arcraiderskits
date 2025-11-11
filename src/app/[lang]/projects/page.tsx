// import { promises as fs } from "fs";
// import path from "path";

// interface Project {
//   id: string;
//   name: string;
//   description?: string;
//   requirements?: any;
//   benefits?: any;
//   [key: string]: any;
// }

// async function getProjects(): Promise<Project[]> {
//   try {
//     const filePath = path.join(process.cwd(), "public", "data", "projects.json");
//     const fileContents = await fs.readFile(filePath, "utf8");
//     return JSON.parse(fileContents);
//   } catch (error) {
//     console.error("Error loading projects:", error);
//     return [];
//   }
// }

// export default async function ProjectsPage() {
//   const projects = await getProjects();

//   return (
//     <>
//       <main className="min-h-screen pt-32 pb-20 px-4">
//         <div className="container mx-auto max-w-7xl">
//           <div className="text-center mb-12">
//             <h1 className="text-5xl font-bold text-[#00ffff] mb-4">Projects</h1>
//             <p className="text-gray-400 text-lg">Research and build projects to advance your capabilities</p>
//             <p className="text-sm text-gray-500 mt-2">Total Projects: {projects.length}</p>
//           </div>

//           {projects.length === 0 ? (
//             <div className="text-center py-20">
//               <p className="text-gray-400 text-xl mb-4">No projects data available yet.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//               {projects.map((project, index) => (
//                 <div
//                   key={`${project.id}-${index}`}
//                   className="bg-[#0d111d]/50 backdrop-blur-sm border  rounded-lg p-6 hover:border-[#00ffff] transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]"
//                 >
//                   <h3 className="text-xl font-bold text-[#00ffff] mb-3">{project.name || "Unknown Project"}</h3>

//                   {project.description && <p className="text-gray-300 mb-4">{project.description}</p>}

//                   {project.requirements && (
//                     <div className="mb-4">
//                       <h4 className="text-md font-semibold text-[#00ffff] mb-2">Requirements:</h4>
//                       <div className="text-sm text-gray-300 bg-gray-900 p-3 rounded">
//                         {typeof project.requirements === "string" ? (
//                           <p>{project.requirements}</p>
//                         ) : (
//                           <pre className="overflow-x-auto">{JSON.stringify(project.requirements, null, 2)}</pre>
//                         )}
//                       </div>
//                     </div>
//                   )}

//                   {project.benefits && (
//                     <div className="mt-4">
//                       <h4 className="text-md font-semibold text-[#00ffff] mb-2">Benefits:</h4>
//                       <div className="text-sm text-gray-300 bg-gray-900 p-3 rounded">
//                         {typeof project.benefits === "string" ? <p>{project.benefits}</p> : <pre className="overflow-x-auto">{JSON.stringify(project.benefits, null, 2)}</pre>}
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

export default async function ProjectsPage() {
  return <></>;
}
