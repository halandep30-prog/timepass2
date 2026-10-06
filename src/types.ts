export interface TableDef { table: string; columns: string[] }
export interface RoadmapItem { week: string; title: string; tasks: string }
export interface VivaItem { question: string; answer: string }

export interface ProjectPlan {
  title: string;
  category: string;
  difficulty: string;
  problem: string;
  solution: string;
  objectives: string[];
  features: string[];
  techStack: { frontend: string; backend: string; database: string; ai: string; deployment: string };
  architecture: string[];
  database: TableDef[];
  roadmap: RoadmapItem[];
  viva: VivaItem[];
}
