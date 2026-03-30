import fs from 'fs';
import path from 'path';
import unzipper from 'unzipper';

export interface ParsedFile {
  filePath: string;
  language: string;
  controllers: string[];
  services: string[];
  models: string[];
  routes: string[];
  entities: string[];
}

export interface CodebaseStructure {
  projectName: string;
  type: string; // 'express' | 'spring-boot' | 'django' | 'unknown'
  files: ParsedFile[];
  summary: string;
}

const SUPPORTED_EXTENSIONS = ['.ts', '.js', '.java', '.py', '.go', '.cs', '.rb'];

// Regex patterns for different frameworks
const PATTERNS = {
  expressController: /router\.(get|post|put|patch|delete|use)\s*\(/gi,
  expressRoute: /app\.(get|post|put|patch|delete|use)\s*\(['"]/gi,
  classController: /class\s+(\w*(Controller|Handler|Resource)\w*)/gi,
  classService: /class\s+(\w*(Service|Manager|Provider|Helper)\w*)/gi,
  classModel: /class\s+(\w*(Model|Entity|Schema|Repository|Repo)\w*)/gi,
  mongooseModel: /mongoose\.model\s*\(\s*['"](\w+)['"]/gi,
  importStatement: /import\s+.*from\s+['"](.*)['"]/gi,
  springController: /@(RestController|Controller|RequestMapping)/gi,
  springService: /@(Service|Component)/gi,
  springRepository: /@(Repository)/gi,
  djangoView: /class\s+\w+(View|ViewSet|APIView)/gi,
  djangoModel: /class\s+\w+\(models\.Model\)/gi,
};

function detectLanguage(ext: string): string {
  const map: Record<string, string> = {
    '.ts': 'TypeScript',
    '.js': 'JavaScript',
    '.java': 'Java',
    '.py': 'Python',
    '.go': 'Go',
    '.cs': 'C#',
    '.rb': 'Ruby',
  };
  return map[ext] || 'Unknown';
}

function detectProjectType(files: string[]): string {
  const fileSet = files.join(' ');
  if (fileSet.includes('pom.xml') || fileSet.includes('build.gradle')) return 'spring-boot';
  if (fileSet.includes('requirements.txt') || fileSet.includes('manage.py')) return 'django';
  if (fileSet.includes('go.mod')) return 'go';
  if (fileSet.includes('package.json')) return 'express/node';
  return 'unknown';
}

function parseFileContent(content: string, filePath: string): ParsedFile {
  const ext = path.extname(filePath).toLowerCase();
  const language = detectLanguage(ext);

  const controllers: string[] = [];
  const services: string[] = [];
  const models: string[] = [];
  const routes: string[] = [];
  const entities: string[] = [];

  // Extract class names
  const classMatches = content.matchAll(/class\s+(\w+)/g);
  for (const match of classMatches) {
    const name = match[1];
    if (/Controller|Handler|Resource/.test(name)) controllers.push(name);
    else if (/Service|Manager|Provider/.test(name)) services.push(name);
    else if (/Model|Entity|Schema|Repository/.test(name)) models.push(name);
    else entities.push(name);
  }

  // Extract Mongoose models
  const mongooseMatches = content.matchAll(PATTERNS.mongooseModel);
  for (const match of mongooseMatches) {
    models.push(match[1]);
  }

  // Extract Express routes
  const routeMatches = content.matchAll(/router\.(get|post|put|patch|delete)\s*\(\s*['"]([^'"]+)['"]/gi);
  for (const match of routeMatches) {
    routes.push(`${match[1].toUpperCase()} ${match[2]}`);
  }

  // Extract function names (services/controllers)
  const funcMatches = content.matchAll(/(?:export\s+)?(?:async\s+)?function\s+(\w+)/g);
  for (const match of funcMatches) {
    const name = match[1];
    if (name.length > 3 && !['main', 'init', 'setup', 'config'].includes(name)) {
      if (/[Cc]ontroller|[Hh]andler/.test(filePath)) {
        controllers.push(name);
      } else if (/[Ss]ervice|[Ss]vc/.test(filePath)) {
        services.push(name);
      }
    }
  }

  return { filePath, language, controllers, services, models, routes, entities };
}

export async function parseZipFile(zipPath: string): Promise<CodebaseStructure> {
  const files: ParsedFile[] = [];
  const allFilePaths: string[] = [];

  return new Promise((resolve, reject) => {
    fs.createReadStream(zipPath)
      .pipe(unzipper.Parse())
      .on('entry', (entry) => {
        const filePath: string = entry.path;
        const type: string = entry.type;

        if (type === 'File') {
          allFilePaths.push(filePath);
          const ext = path.extname(filePath).toLowerCase();

          if (SUPPORTED_EXTENSIONS.includes(ext)) {
            const chunks: Buffer[] = [];
            entry.on('data', (chunk: Buffer) => chunks.push(chunk));
            entry.on('end', () => {
              try {
                const content = Buffer.concat(chunks).toString('utf-8').slice(0, 5000); // limit per file
                const parsed = parseFileContent(content, filePath);
                if (
                  parsed.controllers.length > 0 ||
                  parsed.services.length > 0 ||
                  parsed.models.length > 0 ||
                  parsed.routes.length > 0
                ) {
                  files.push(parsed);
                }
              } catch {
                // skip unparseable files
              }
            });
          } else {
            entry.autodrain();
          }
        } else {
          entry.autodrain();
        }
      })
      .on('close', () => {
        const projectType = detectProjectType(allFilePaths);
        const summary = buildSummary(files, projectType);

        resolve({
          projectName: path.basename(zipPath, '.zip'),
          type: projectType,
          files,
          summary,
        });
      })
      .on('error', reject);
  });
}

function buildSummary(files: ParsedFile[], projectType: string): string {
  const allControllers = [...new Set(files.flatMap((f) => f.controllers))];
  const allServices = [...new Set(files.flatMap((f) => f.services))];
  const allModels = [...new Set(files.flatMap((f) => f.models))];
  const allRoutes = [...new Set(files.flatMap((f) => f.routes))].slice(0, 30);
  const fileNames = files.map((f) => f.filePath).slice(0, 20);

  return `
Project Type: ${projectType}

Files Analyzed (${files.length} total):
${fileNames.join('\n')}

Controllers (${allControllers.length}):
${allControllers.slice(0, 20).join(', ')}

Services (${allServices.length}):
${allServices.slice(0, 20).join(', ')}

Models/Entities (${allModels.length}):
${allModels.slice(0, 20).join(', ')}

API Routes (${allRoutes.length}):
${allRoutes.slice(0, 15).join('\n')}
`.trim();
}
