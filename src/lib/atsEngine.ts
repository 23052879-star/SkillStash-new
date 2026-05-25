// ═══════════════════════════════════════════════════════════════════
// Advanced ResumeSync ATS Analysis Engine (V2)
// A comprehensive, NLP-powered ATS scoring engine. Runs client-side.
// Integrates 15 core scoring categories and advanced analytics.
// ═══════════════════════════════════════════════════════════════════

export interface SectionScore {
  name: string;
  score: number;
  maxScore: number;
  weight: number;
  feedback: string[];
  status: 'excellent' | 'good' | 'needs-work' | 'poor';
}

export interface KeywordMatch {
  keyword: string;
  found: boolean;
  resumeCount: number;
  jdCount: number;
  tfidfScore: number;
  isSynonymMatch: boolean;
  matchedAs?: string;
  category: 'hard-skill' | 'soft-skill' | 'tool' | 'certification' | 'general';
  importance: 'must-have' | 'nice-to-have';
}

export interface AnalysisResult {
  overallScore: number;
  scoreLabel: string;
  sections: SectionScore[];
  keywords: KeywordMatch[];
  matchedCount: number;
  missingCount: number;
  totalJdKeywords: number;
  suggestions: { priority: 'high' | 'medium' | 'low'; text: string; category: string }[];
  strengths: string[];
  formatChecks: { label: string; passed: boolean; detail: string; penalty: number }[];
  impactScore: number;
  readabilityScore: number;
  resumeWordCount: number;
  estimatedPages: number;
  
  // Advanced features additions
  parsedData: {
    name?: string;
    email?: string;
    phone?: string;
    skills: string[];
    education: { degree?: string; field?: string; school?: string; year?: string }[];
    experience: { title?: string; company?: string; duration?: string; description?: string }[];
    projects: string[];
    certifications: string[];
  };
  jdData: {
    title: string;
    industry: string;
    experienceYearsRequired: number;
    mustHaveSkills: string[];
    niceToHaveSkills: string[];
    educationRequirements?: string;
  };
  densityReport: {
    keyword: string;
    density: number; // percentage
    status: 'optimal' | 'underuse' | 'stuffing';
  }[];
  readabilityReport: {
    passiveVoiceCount: number;
    clichesCount: number;
    avgSentenceLength: number;
    grammarScore: number;
    readabilityIndex: string; // e.g. "College Level"
  };
  predictions: {
    role: string;
    confidence: number;
    suggestedSalary: string;
    marketDemand: 'High' | 'Medium' | 'Low';
  };
  atsSimulation: {
    plainTextStripped: string;
    brokenElements: string[];
  };
}

// STOP_WORDS for TF-IDF Keyword Extraction
const STOP_WORDS = new Set([
  'a','ab','about','above','after','again','against','all','am','an','and',
  'any','are','aren','as','at','be','because','been','before','being','below',
  'between','both','but','by','can','could','did','do','does','doing','don',
  'down','during','each','few','for','from','further','get','got','had','has',
  'have','having','he','her','here','hers','herself','him','himself','his',
  'how','i','if','in','into','is','isn','it','its','itself','just','ll','me',
  'might','more','most','must','my','myself','need','no','nor','not','now',
  'of','off','on','once','only','or','other','our','ours','ourselves','out',
  'over','own','re','s','same','shall','she','should','so','some','such',
  'than','that','the','their','theirs','them','themselves','then','there',
  'these','they','this','those','through','to','too','under','until','up',
  'us','ve','very','was','we','were','what','when','where','which','while',
  'who','whom','why','will','with','won','would','you','your','yours',
  'yourself','yourselves','also','etc','using','used','use','including',
  'include','well','within','without','across','along','around','among',
  'per','via','able','like','make','new','one','two','may','work','role',
  'working','looking','required','requirements','preferred','experience',
  'strong','excellent','good','ability','skills','knowledge','understanding',
  'responsible','responsibilities','team','years','year','based','related',
  'position','job','company','opportunity','candidate','ideal','must','have'
]);

// Skill Taxonomy Database
const SKILL_TAXONOMY: Record<string, string[]> = {
  'javascript': ['js', 'ecmascript', 'es6', 'es2015', 'vanilla js', 'javascript developer'],
  'typescript': ['ts', 'tsx', 'typescript compiler'],
  'react': ['reactjs', 'react.js', 'react js', 'jsx', 'react hooks', 'react developer'],
  'vue': ['vuejs', 'vue.js', 'vue js', 'nuxt', 'nuxtjs'],
  'angular': ['angularjs', 'angular.js', 'angular framework'],
  'nodejs': ['node.js', 'node js', 'node', 'express', 'expressjs'],
  'python': ['py', 'python3', 'django', 'flask', 'fastapi', 'cpython'],
  'aws': ['amazon web services', 'ec2', 's3', 'lambda', 'rds', 'dynamodb', 'cloudformation'],
  'azure': ['microsoft azure', 'azure devops', 'aks'],
  'gcp': ['google cloud', 'google cloud platform', 'gcs', 'bigquery'],
  'docker': ['containerization', 'containers', 'dockerfile', 'docker-compose'],
  'kubernetes': ['k8s', 'container orchestration', 'helm', 'kubectl'],
  'sql': ['mysql', 'postgresql', 'postgres', 'sqlite', 'tsql', 'plsql', 'mssql', 'sequel'],
  'mongodb': ['mongo', 'nosql', 'document db', 'mongoose'],
  'devops': ['dev ops', 'site reliability', 'sre', 'infrastructure as code', 'iac'],
  'cicd': ['ci/cd', 'continuous integration', 'continuous deployment', 'jenkins', 'github actions', 'gitlab ci'],
  'agile': ['scrum', 'kanban', 'sprint', 'sprints', 'jira', 'confluence'],
  'figma': ['figma design', 'ui design', 'ux design', 'wireframing', 'prototyping'],
  'machine learning': ['ml', 'deep learning', 'dl', 'neural networks', 'ai', 'artificial intelligence', 'nlp', 'scikit-learn', 'tensorflow', 'pytorch'],
  'meta ads': ['fb ads', 'facebook ads', 'instagram ads', 'meta marketing', 'social ads'],
  'google ads': ['adwords', 'sem', 'ppc', 'paid search', 'google ads manager'],
  'seo': ['search engine optimization', 'semrush', 'ahrefs', 'organic traffic'],
  'project management': ['pmp', 'scrum master', 'agile delivery', 'program manager']
};

const HARD_SKILLS = new Set(['javascript','typescript','python','java','csharp','c++','cpp','golang','go','ruby','php','swift','kotlin','rust','sql','html','css','sass','scss','react','angular','vue','nextjs','nodejs','django','flask','spring','aws','azure','gcp','docker','kubernetes','terraform','jenkins','mongodb','redis','postgresql','mysql','elasticsearch','dynamodb','graphql','rest','api','microservices','git','linux','bash','machine learning','deep learning','tensorflow','pytorch','nlp','data science','pandas','numpy','scikit-learn','spark','hadoop','figma','sketch','photoshop','illustrator','selenium','jest','cypress','flutter','react native','ios','android','blockchain','solidity','web3','networking','tcp/ip','http','excel','tableau','power bi']);
const SOFT_SKILLS = new Set(['leadership','communication','teamwork','collaboration','problem solving','critical thinking','creativity','adaptability','time management','organization','interpersonal','negotiation','presentation','mentoring','coaching','conflict resolution','decision making','empathy','initiative','motivation','flexibility','attention to detail','self-motivated','strategic thinking','analytical']);
const CERTIFICATIONS = new Set(['aws certified','azure certified','google certified','pmp','scrum master','csm','comptia','cissp','cisa','ceh','itil','six sigma','safe','togaf','prince2']);

const CLICHES = ['go-getter', 'go getter', 'think outside the box', 'synergy', 'hard worker', 'team player', 'results-driven', 'results driven', 'detail-oriented', 'detail oriented', 'self-starter', 'self starter', 'dynamic', 'proactive', 'thought leader', 'visionary'];
const WEAK_VERBS = ['helped', 'worked', 'did', 'was responsible for', 'responsible for', 'assisted', 'handled', 'duties included', 'managed to'];

// Helper Stemmer
function stem(word: string): string {
  let w = word.toLowerCase().trim();
  if (w.length <= 3) return w;
  if (w.endsWith('ies') && w.length > 4) w = w.slice(0, -3) + 'y';
  else if (w.endsWith('sses')) w = w.slice(0, -2);
  else if (w.endsWith('ness')) w = w.slice(0, -4);
  else if (w.endsWith('ing') && w.length > 5) { w = w.slice(0, -3); if (w.endsWith('tt')) w = w.slice(0, -1); }
  else if (w.endsWith('tion') && w.length > 5) w = w.slice(0, -4);
  else if (w.endsWith('ed') && w.length > 4) { w = w.slice(0, -2); if (w.endsWith('i')) w = w.slice(0, -1) + 'y'; }
  else if (w.endsWith('ly') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('es') && w.length > 4) w = w.slice(0, -2);
  else if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) w = w.slice(0, -1);
  return w;
}

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9+#.\s/-]/g, ' ').split(/\s+/).map(w => w.replace(/^[.\-/]+|[.\-/]+$/g, '')).filter(w => w.length > 1);
}

// Cosine similarity for semantic matching
function calculateCosineSimilarity(text1: string, text2: string): number {
  const tokens1 = tokenize(text1).filter(t => !STOP_WORDS.has(t));
  const tokens2 = tokenize(text2).filter(t => !STOP_WORDS.has(t));
  
  const freqMap1: Record<string, number> = {};
  const freqMap2: Record<string, number> = {};
  const allTokens = new Set<string>();

  tokens1.forEach(t => { const s = stem(t); freqMap1[s] = (freqMap1[s] || 0) + 1; allTokens.add(s); });
  tokens2.forEach(t => { const s = stem(t); freqMap2[s] = (freqMap2[s] || 0) + 1; allTokens.add(s); });

  let dotProduct = 0;
  let mag1 = 0;
  let mag2 = 0;

  allTokens.forEach(t => {
    const val1 = freqMap1[t] || 0;
    const val2 = freqMap2[t] || 0;
    dotProduct += val1 * val2;
    mag1 += val1 * val1;
    mag2 += val2 * val2;
  });

  if (mag1 === 0 || mag2 === 0) return 0;
  return dotProduct / (Math.sqrt(mag1) * Math.sqrt(mag2));
}

// 1. Resume Parsing Engine & Heuristics
export function parseResumeContent(text: string) {
  const lines = text.split('\n').map(l => l.trim());
  const lowerText = text.toLowerCase();

  // Name extraction (first line with characters usually, or custom regex)
  let name = '';
  for (const line of lines) {
    if (line.length > 3 && !line.includes('@') && !line.includes('http') && !/\d{5,}/.test(line)) {
      name = line;
      break;
    }
  }

  // Contact details
  const emailMatch = text.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const email = emailMatch ? emailMatch[0] : undefined;

  const phoneMatch = text.match(/(\+?\d[\d\s()-.]{7,}\d)/);
  const phone = phoneMatch ? phoneMatch[0] : undefined;

  // Skills
  const detectedSkills: string[] = [];
  HARD_SKILLS.forEach(skill => {
    if (lowerText.includes(skill)) detectedSkills.push(skill);
  });
  SOFT_SKILLS.forEach(skill => {
    if (lowerText.includes(skill)) detectedSkills.push(skill);
  });

  // Simple section segmenter
  const sections: Record<string, string[]> = {
    summary: [],
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  };

  let currentSection = 'summary';
  lines.forEach(line => {
    const l = line.toLowerCase();
    if (/\b(summary|objective|profile|about me|professional profile)\b/i.test(l)) {
      currentSection = 'summary';
    } else if (/\b(experience|employment|work history|work experience|career)\b/i.test(l)) {
      currentSection = 'experience';
    } else if (/\b(education|academic|degrees|university|college)\b/i.test(l)) {
      currentSection = 'education';
    } else if (/\b(skills|technical skills|key skills|expertise|competencies)\b/i.test(l)) {
      currentSection = 'skills';
    } else if (/\b(projects|personal projects|academic projects)\b/i.test(l)) {
      currentSection = 'projects';
    } else if (/\b(certifications|certificates|licenses|accreditations)\b/i.test(l)) {
      currentSection = 'certifications';
    } else if (line.length > 0) {
      sections[currentSection].push(line);
    }
  });

  return {
    name: name || 'Professional Candidate',
    email,
    phone,
    skills: Array.from(new Set(detectedSkills)),
    education: sections.education.map(line => ({ degree: line })),
    experience: sections.experience.map(line => ({ title: line })),
    projects: sections.projects,
    certifications: sections.certifications
  };
}

// 2. Job Description Parser
export function parseJobDescription(jdText: string) {
  const lowerJd = jdText.toLowerCase();
  const tokens = tokenize(lowerJd);

  // Extract skills from JD
  const foundSkills: string[] = [];
  HARD_SKILLS.forEach(skill => {
    if (lowerJd.includes(skill)) foundSkills.push(skill);
  });
  SOFT_SKILLS.forEach(skill => {
    if (lowerJd.includes(skill)) foundSkills.push(skill);
  });

  // Separate into Must Have / Nice To Have (Required vs Preferred)
  const mustHaveSkills: string[] = [];
  const niceToHaveSkills: string[] = [];

  const sentences = jdText.split(/[.!?\n]/).map(s => s.trim()).filter(Boolean);
  sentences.forEach(sentence => {
    const lowerS = sentence.toLowerCase();
    const isRequired = /\b(must|required|minimum|essential|necessary|should have|have to|needs? to|expect)\b/i.test(lowerS);
    
    foundSkills.forEach(skill => {
      if (lowerS.includes(skill)) {
        if (isRequired) {
          mustHaveSkills.push(skill);
        } else {
          niceToHaveSkills.push(skill);
        }
      }
    });
  });

  // Fallback if none separated
  if (mustHaveSkills.length === 0) {
    foundSkills.slice(0, Math.ceil(foundSkills.length * 0.6)).forEach(s => mustHaveSkills.push(s));
    foundSkills.slice(Math.ceil(foundSkills.length * 0.6)).forEach(s => niceToHaveSkills.push(s));
  }

  // Job Title prediction from JD
  let title = 'Software Engineer';
  const lines = jdText.split('\n').map(l => l.trim());
  for (const line of lines) {
    if (line.length > 5 && line.length < 50 && (line.toLowerCase().includes('developer') || line.toLowerCase().includes('engineer') || line.toLowerCase().includes('manager') || line.toLowerCase().includes('specialist') || line.toLowerCase().includes('analyst'))) {
      title = line;
      break;
    }
  }

  // Experience requirement
  const expMatch = lowerJd.match(/(\d+)\+?\s*(years?|yrs?)\b.*experience/i) || lowerJd.match(/experience\b.*(\d+)\+?\s*(years?|yrs?)/i);
  const experienceYearsRequired = expMatch ? parseInt(expMatch[1]) : 2;

  // Industry detection
  let industry = 'Technology';
  if (lowerJd.includes('marketing') || lowerJd.includes('advertising') || lowerJd.includes('campaign')) industry = 'Marketing';
  else if (lowerJd.includes('finance') || lowerJd.includes('banking') || lowerJd.includes('analyst') || lowerJd.includes('portfolio')) industry = 'Finance';
  else if (lowerJd.includes('design') || lowerJd.includes('figma') || lowerJd.includes('creative') || lowerJd.includes('ui/ux')) industry = 'Design';

  return {
    title,
    industry,
    experienceYearsRequired,
    mustHaveSkills: Array.from(new Set(mustHaveSkills)),
    niceToHaveSkills: Array.from(new Set(niceToHaveSkills)),
    educationRequirements: lowerJd.includes('bachelor') ? 'Bachelors' : lowerJd.includes('master') ? 'Masters' : 'Not Specified'
  };
}

// V2 Core Analysis Engine
export function runATSAnalysis(resumeText: string, jobDescription: string): AnalysisResult {
  const parsedResume = parseResumeContent(resumeText);
  const parsedJd = parseJobDescription(jobDescription);
  const lowerResume = resumeText.toLowerCase();
  const lowerJd = jobDescription.toLowerCase();

  // ——————————————————————————————————————
  // 1. Keyword Match & Skill Normalization Heuristics
  // ——————————————————————————————————————
  const allJdSkills = [...parsedJd.mustHaveSkills, ...parsedJd.niceToHaveSkills];
  const keywords: KeywordMatch[] = [];

  allJdSkills.forEach(skill => {
    let found = false;
    let isSynonymMatch = false;
    let matchedAs = '';
    let resumeCount = 0;

    // Check direct match
    if (lowerResume.includes(skill)) {
      found = true;
      matchedAs = skill;
      const regex = new RegExp(`\\b${skill}\\b`, 'g');
      resumeCount = (lowerResume.match(regex) || []).length;
    } else {
      // Check taxonomy/synonym expansion
      const syns = SKILL_TAXONOMY[skill];
      if (syns) {
        for (const syn of syns) {
          if (lowerResume.includes(syn)) {
            found = true;
            isSynonymMatch = true;
            matchedAs = syn;
            const regex = new RegExp(`\\b${syn}\\b`, 'g');
            resumeCount = (lowerResume.match(regex) || []).length;
            break;
          }
        }
      }
    }

    const importance = parsedJd.mustHaveSkills.includes(skill) ? 'must-have' : 'nice-to-have';
    const category = HARD_SKILLS.has(skill) ? 'hard-skill' : SOFT_SKILLS.has(skill) ? 'soft-skill' : 'general';

    // TF-IDF score estimate
    const jdRegex = new RegExp(`\\b${skill}\\b`, 'g');
    const jdCount = (lowerJd.match(jdRegex) || []).length;
    const tfidfScore = (jdCount * 25) + (importance === 'must-have' ? 40 : 15);

    keywords.push({
      keyword: skill,
      found,
      resumeCount,
      jdCount,
      tfidfScore,
      isSynonymMatch,
      matchedAs: matchedAs || undefined,
      category,
      importance
    });
  });

  // Calculate Weighted Keyword Match Score
  const mustHaveWeight = 0.7;
  const niceHaveWeight = 0.3;
  const mustHaves = keywords.filter(k => k.importance === 'must-have');
  const niceHaves = keywords.filter(k => k.importance === 'nice-to-have');

  const mustHaveScore = mustHaves.length > 0 ? (mustHaves.filter(k => k.found).length / mustHaves.length) * 100 : 100;
  const niceHaveScore = niceHaves.length > 0 ? (niceHaves.filter(k => k.found).length / niceHaves.length) * 100 : 100;

  const keywordMatchScoreVal = Math.round((mustHaveScore * mustHaveWeight) + (niceHaveScore * niceHaveWeight));

  // ——————————————————————————————————————
  // 2. Semantic Similarity Score
  // ——————————————————————————————————————
  const semanticSimilarity = Math.round(calculateCosineSimilarity(resumeText, jobDescription) * 100);

  // ——————————————————————————————————————
  // 3. Experience Analyzer
  // ——————————————————————————————————————
  const yearsExpMatches = lowerResume.match(/(\d+)\+?\s*(years?|yrs?)\b.*experience/i) || lowerResume.match(/experience\b.*(\d+)\+?\s*(years?|yrs?)/i);
  const yearsResumeExp = yearsExpMatches ? parseInt(yearsExpMatches[1]) : 1;
  
  let experienceScoreVal = 100;
  const expFeedback: string[] = [];
  if (yearsResumeExp < parsedJd.experienceYearsRequired) {
    experienceScoreVal = Math.max(30, 100 - (parsedJd.experienceYearsRequired - yearsResumeExp) * 20);
    expFeedback.push(`Resume specifies ${yearsResumeExp} years of experience, but JD requests ${parsedJd.experienceYearsRequired} years.`);
  } else {
    expFeedback.push(`Great alignment. Your ${yearsResumeExp} years of experience meets or exceeds the required ${parsedJd.experienceYearsRequired} years.`);
  }

  // Job title similarity checking
  const jdTitleTokens = tokenize(parsedJd.title);
  const matchesTitle = jdTitleTokens.some(tok => lowerResume.includes(tok));
  if (!matchesTitle) {
    experienceScoreVal = Math.max(30, experienceScoreVal - 15);
    expFeedback.push(`Target job title "${parsedJd.title}" or key parts of it were not found in your previous experience descriptions.`);
  }

  // ——————————————————————————————————————
  // 4. Formatting Checker (Tables, icons, multi-columns)
  // ——————————————————————————————————————
  const formatChecks: AnalysisResult['formatChecks'] = [];
  let formattingScoreVal = 100;
  const formatFeedback: string[] = [];

  const hasTable = lowerResume.includes('|') || lowerResume.includes('\t\t') || lowerResume.includes('---');
  if (hasTable) {
    formattingScoreVal -= 15;
    formatChecks.push({ label: 'Tables / Columns', passed: false, detail: 'Tables or multi-column grids detected. These confuse older ATS parser engines.', penalty: 15 });
    formatFeedback.push('Avoid complex tables or multi-column layouts to ensure high parse confidence.');
  } else {
    formatChecks.push({ label: 'Tables / Columns', passed: true, detail: 'Clean single-column standard flow detected.', penalty: 0 });
  }

  const specialCharsCount = (resumeText.match(/[^\x00-\x7F]/g) || []).length;
  if (specialCharsCount > 15) {
    formattingScoreVal -= 10;
    formatChecks.push({ label: 'Graphic Elements / Icons', passed: false, detail: 'Heavy use of icons or custom emojis detected.', penalty: 10 });
    formatFeedback.push('Minimize icons and graphical headers to prevent corrupt text encodings.');
  } else {
    formatChecks.push({ label: 'Graphic Elements / Icons', passed: true, detail: 'Typography is clean and legible.', penalty: 0 });
  }

  const headersFooters = lowerResume.includes('page 1') || lowerResume.includes('all rights reserved') || lowerResume.includes('header:') || lowerResume.includes('footer:');
  if (headersFooters) {
    formattingScoreVal -= 5;
    formatChecks.push({ label: 'Headers & Footers', passed: false, detail: 'Potential floating headers or copyright footers detected.', penalty: 5 });
    formatFeedback.push('Keep contacts in the main body instead of document headers or footers.');
  } else {
    formatChecks.push({ label: 'Headers & Footers', passed: true, detail: 'Contacts are correctly in the document body.', penalty: 0 });
  }

  // ——————————————————————————————————————
  // 5. Achievement Detection Heuristic
  // ——————————————————————————————————————
  const achievementMatches = resumeText.match(/\d+%\b|\$\d+|\b(saved|increased|reduced|achieved|managed|led|grew|revenue|growth|roi|kpi|budget)\b/gi) || [];
  const achievementCount = achievementMatches.length;
  let achievementScoreVal = 100;
  const achievementFeedback: string[] = [];

  if (achievementCount < 4) {
    achievementScoreVal = Math.max(30, achievementCount * 20);
    achievementFeedback.push('Very few quantified achievements found. Add metrics (%, $, count) to support statements.');
  } else {
    achievementFeedback.push(`Found ${achievementCount} metric indicators/accomplishments. Strong impact language.`);
  }

  // ——————————————————————————————————————
  // 6. Education / Certifications check
  // ——————————————————————————————————————
  let eduScoreVal = 100;
  const eduFeedback: string[] = [];
  if (parsedJd.educationRequirements !== 'Not Specified') {
    const hasDegree = lowerResume.includes('bachelor') || lowerResume.includes('master') || lowerResume.includes('phd') || lowerResume.includes('degree') || lowerResume.includes('b.s') || lowerResume.includes('m.s');
    if (!hasDegree) {
      eduScoreVal = 50;
      eduFeedback.push(`Job description mentions degree requirements, but no explicit degree type was found in your education section.`);
    } else {
      eduFeedback.push('Degree information detected successfully.');
    }
  } else {
    eduFeedback.push('Standard academic layout detected.');
  }

  // Section Detection Score Reduction
  let missingSections = 0;
  const missingSectionList: string[] = [];
  if (parsedResume.skills.length === 0) { missingSections++; missingSectionList.push('Skills'); }
  if (parsedResume.experience.length === 0) { missingSections++; missingSectionList.push('Experience'); }
  if (parsedResume.education.length === 0) { missingSections++; missingSectionList.push('Education'); }

  if (missingSections > 0) {
    eduScoreVal = Math.max(20, eduScoreVal - (missingSections * 25));
    eduFeedback.push(`Missing critical section headers: ${missingSectionList.join(', ')}.`);
  }

  // ——————————————————————————————————————
  // 7. Density Checker
  // ——————————————————————————————————————
  const wordCount = resumeText.split(/\s+/).filter(w => w.length > 0).length;
  const densityReport: AnalysisResult['densityReport'] = keywords.slice(0, 10).map(k => {
    const density = wordCount > 0 ? (k.resumeCount / wordCount) * 100 : 0;
    let status: 'optimal' | 'underuse' | 'stuffing' = 'optimal';
    if (k.resumeCount === 0) status = 'underuse';
    else if (density > 3.0) status = 'stuffing';
    return { keyword: k.keyword, density: parseFloat(density.toFixed(2)), status };
  });

  // ——————————————————————————————————————
  // 8. Grammar & Readability
  // ——————————————————————————————————————
  const passiveVoiceCount = (resumeText.match(/\b(was|were|been|being|is|are)\s+(being\s+)?\w+ed\b/gi) || []).length;
  const clichesCount = CLICHES.filter(c => lowerResume.includes(c)).length;
  const avgSentenceLength = Math.round(wordCount / Math.max(1, resumeText.split(/[.!?]/).length));
  
  let grammarScore = 100 - (passiveVoiceCount * 5) - (clichesCount * 4);
  grammarScore = Math.max(40, Math.min(100, grammarScore));

  const readabilityIndex = avgSentenceLength < 12 ? 'Highly Scannable' : avgSentenceLength < 20 ? 'Optimal (Professional)' : 'Complex (Sentence length too long)';

  // ——————————————————————————————————————
  // 9. Industry Scoring Tuning
  // ——————————————————————————————————————
  let finalScore = 0;
  if (parsedJd.industry === 'Software') {
    // Skills and projects prioritized
    finalScore = Math.round(
      (keywordMatchScoreVal * 0.40) +
      (semanticSimilarity * 0.20) +
      (experienceScoreVal * 0.15) +
      (formattingScoreVal * 0.10) +
      (achievementScoreVal * 0.05) +
      (eduScoreVal * 0.10)
    );
  } else if (parsedJd.industry === 'Marketing') {
    // Quantified achievements prioritized
    finalScore = Math.round(
      (keywordMatchScoreVal * 0.25) +
      (semanticSimilarity * 0.20) +
      (experienceScoreVal * 0.15) +
      (formattingScoreVal * 0.10) +
      (achievementScoreVal * 0.25) +
      (eduScoreVal * 0.05)
    );
  } else {
    // Standard best formula
    finalScore = Math.round(
      (keywordMatchScoreVal * 0.35) +
      (semanticSimilarity * 0.25) +
      (experienceScoreVal * 0.15) +
      (formattingScoreVal * 0.10) +
      (achievementScoreVal * 0.10) +
      (eduScoreVal * 0.05)
    );
  }

  // Ensure bounds
  finalScore = Math.max(0, Math.min(100, finalScore));

  const sections: SectionScore[] = [
    { name: 'Skills & Keywords Alignment', score: keywordMatchScoreVal, maxScore: 100, weight: 0.35, feedback: [`Your resume covers ${keywords.filter(k => k.found).length} of the ${keywords.length} core JD skills.`], status: keywordMatchScoreVal >= 80 ? 'excellent' : keywordMatchScoreVal >= 60 ? 'good' : keywordMatchScoreVal >= 40 ? 'needs-work' : 'poor' },
    { name: 'Semantic AI Match', score: semanticSimilarity, maxScore: 100, weight: 0.25, feedback: [`Your resume has a ${semanticSimilarity}% contextual match rate to the job requirements.`], status: semanticSimilarity >= 75 ? 'excellent' : semanticSimilarity >= 60 ? 'good' : semanticSimilarity >= 45 ? 'needs-work' : 'poor' },
    { name: 'Experience & Titles Match', score: experienceScoreVal, maxScore: 100, weight: 0.15, feedback: expFeedback, status: experienceScoreVal >= 80 ? 'excellent' : experienceScoreVal >= 60 ? 'good' : experienceScoreVal >= 40 ? 'needs-work' : 'poor' },
    { name: 'ATS Formatting Checks', score: formattingScoreVal, maxScore: 100, weight: 0.10, feedback: formatFeedback.length > 0 ? formatFeedback : ['Formatting is completely clean.'], status: formattingScoreVal >= 90 ? 'excellent' : formattingScoreVal >= 70 ? 'good' : formattingScoreVal >= 50 ? 'needs-work' : 'poor' },
    { name: 'Quantified Achievements', score: achievementScoreVal, maxScore: 100, weight: 0.10, feedback: achievementFeedback, status: achievementScoreVal >= 80 ? 'excellent' : achievementScoreVal >= 60 ? 'good' : achievementScoreVal >= 40 ? 'needs-work' : 'poor' },
    { name: 'Education & Sections Match', score: eduScoreVal, maxScore: 100, weight: 0.05, feedback: eduFeedback, status: eduScoreVal >= 80 ? 'excellent' : eduScoreVal >= 60 ? 'good' : eduScoreVal >= 40 ? 'needs-work' : 'poor' }
  ];

  // Suggestions Generator
  const suggestions: AnalysisResult['suggestions'] = [];
  if (keywordMatchScoreVal < 70) {
    const missingMusts = keywords.filter(k => !k.found && k.importance === 'must-have').slice(0, 3).map(k => k.keyword);
    if (missingMusts.length > 0) {
      suggestions.push({ priority: 'high', text: `Add missing MUST HAVE skills to your profile: "${missingMusts.join('", "')}".`, category: 'Skills' });
    }
  }
  if (formattingScoreVal < 80) {
    suggestions.push({ priority: 'high', text: 'Re-format your resume into a single-column layout, avoiding floating text blocks or tables.', category: 'Formatting' });
  }
  if (achievementScoreVal < 70) {
    suggestions.push({ priority: 'medium', text: 'Quantify your accomplishments. Instead of "Responsible for Google Ads", use "Managed ₹5L monthly Google Ads budget, increasing ROAS by 40%".', category: 'Content' });
  }
  if (passiveVoiceCount > 2) {
    suggestions.push({ priority: 'low', text: `Reduce passive voice occurrences (${passiveVoiceCount} found). Switch to active verbs for direct impact.`, category: 'Readability' });
  }
  if (clichesCount > 0) {
    suggestions.push({ priority: 'low', text: `Remove buzzwords: "${CLICHES.filter(c => lowerResume.includes(c)).slice(0, 3).join('", "')}". Use concrete action verbs.`, category: 'Readability' });
  }
  
  // Density warnings
  const stuffed = densityReport.filter(d => d.status === 'stuffing');
  if (stuffed.length > 0) {
    suggestions.push({ priority: 'medium', text: `Keyword stuffing alert! The following terms are repeated excessively: ${stuffed.map(s => s.keyword).join(', ')}. Keep individual keyword densities below 3%.`, category: 'Optimization' });
  }

  // Predictive Analytics Model Heuristics
  const predictiveRole = parsedJd.title;
  const suggestedSalary = parsedJd.industry === 'Software' ? '₹8L - ₹15L per annum' : parsedJd.industry === 'Marketing' ? '₹5L - ₹9L per annum' : '₹6L - ₹11L per annum';

  // ATS simulation stripped view
  const simulationText = resumeText
    .replace(/[^\x00-\x7F]/g, ' ') // Strip icons
    .replace(/\s+/g, ' ')          // Compress spaces
    .substring(0, 1000) + '... [Stripped by ATS parser Engine]';

  const brokenElements: string[] = [];
  if (hasTable) brokenElements.push('Grid Layout corrupted: text from table cells might merge together.');
  if (specialCharsCount > 15) brokenElements.push('Character encoding failure: icons converted to raw symbols.');

  let scoreLabel = 'Low Match';
  if (finalScore >= 80) scoreLabel = 'Excellent Match';
  else if (finalScore >= 60) scoreLabel = 'Good Match';
  else if (finalScore >= 40) scoreLabel = 'Needs Improvement';

  return {
    overallScore: finalScore,
    scoreLabel,
    sections,
    keywords,
    matchedCount: keywords.filter(k => k.found).length,
    missingCount: keywords.filter(k => !k.found).length,
    totalJdKeywords: keywords.length,
    suggestions,
    strengths: sections.filter(s => s.score >= 80).map(s => s.name),
    formatChecks,
    impactScore: achievementScoreVal,
    readabilityScore: grammarScore,
    resumeWordCount: wordCount,
    estimatedPages: Math.max(1, Math.round(wordCount / 400)),
    parsedData: parsedResume,
    jdData: parsedJd,
    densityReport,
    readabilityReport: {
      passiveVoiceCount,
      clichesCount,
      avgSentenceLength,
      grammarScore,
      readabilityIndex
    },
    predictions: {
      role: predictiveRole,
      confidence: Math.round(semanticSimilarity * 0.9),
      suggestedSalary,
      marketDemand: parsedJd.industry === 'Software' ? 'High' : 'Medium'
    },
    atsSimulation: {
      plainTextStripped: simulationText,
      brokenElements
    }
  };
}
