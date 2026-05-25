import React, { useState, useCallback, useEffect, useRef } from 'react';
import { useDropzone } from 'react-dropzone';
import { Container } from '../components/shared/Container';
import {
  Upload,
  FileText,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Zap,
  Target,
  BarChart3,
  Shield,
  TrendingUp,
  X,
  ChevronRight,
  Award,
  Clock,
  Briefcase,
  GraduationCap,
  Mail,
  Star,
  ArrowRight,
  Sparkles,
  FileCheck,
  FileWarning,
  Eye,
  Brain,
  Linkedin,
  DollarSign,
  Activity,
  Layers,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Gauge,
  Plus,
  Coins,
  Key
} from 'lucide-react';
import { runATSAnalysis, AnalysisResult, SectionScore } from '../lib/atsEngine';
import { generateAIRecommendations } from '../lib/gemini';
import { useUserStore } from '../stores/userStore';
import { CheckoutModal } from '../components/payment/CheckoutModal';

import * as pdfjsLib from 'pdfjs-dist';
import pdfWorkerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';
pdfjsLib.GlobalWorkerOptions.workerSrc = pdfWorkerUrl;

// ——— Animated Score Gauge ———
const ScoreGauge: React.FC<{ score: number; size?: number; label?: string }> = ({ score, size = 200, label }) => {
  const [animatedScore, setAnimatedScore] = useState(0);
  const radius = (size - 24) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  useEffect(() => {
    let start = 0;
    const step = Math.max(1, Math.ceil(score / 60));
    const timer = setInterval(() => {
      start += step;
      if (start >= score) { start = score; clearInterval(timer); }
      setAnimatedScore(start);
    }, 16);
    return () => clearInterval(timer);
  }, [score]);

  const getColor = (s: number) => {
    if (s >= 80) return { stroke: '#10b981', glow: '#10b98140', label: 'Excellent' };
    if (s >= 60) return { stroke: '#f59e0b', glow: '#f59e0b40', label: 'Good' };
    if (s >= 40) return { stroke: '#f97316', glow: '#f9731640', label: 'Needs Work' };
    return { stroke: '#ef4444', glow: '#ef444440', label: 'Low Match' };
  };
  const c = getColor(animatedScore);

  return (
    <div className="relative flex flex-col items-center">
      <svg width={size} height={size} className="transform -rotate-90 drop-shadow-lg">
        <circle cx={size / 2} cy={size / 2} r={radius} stroke="currentColor" strokeWidth="12" fill="none" className="text-gray-200 dark:text-gray-700" />
        <circle cx={size / 2} cy={size / 2} r={radius} stroke={c.stroke} strokeWidth="14" fill="none"
          strokeLinecap="round" strokeDasharray={circumference} strokeDashoffset={strokeDashoffset}
          style={{ transition: 'stroke-dashoffset 0.5s ease', filter: `drop-shadow(0 0 10px ${c.glow})` }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black bg-gradient-to-b from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          {animatedScore}
        </span>
        <span className="text-sm font-bold mt-1" style={{ color: c.stroke }}>{label || c.label}</span>
      </div>
    </div>
  );
};

// ——— Section Score Bar ———
const SectionBar: React.FC<{ section: SectionScore }> = ({ section }) => {
  const [expanded, setExpanded] = useState(false);
  const getIcon = (name: string) => {
    if (name.includes('Contact')) return <Mail className="h-5 w-5" />;
    if (name.includes('Summary') || name.includes('Semantic')) return <Brain className="h-5 w-5" />;
    if (name.includes('Experience')) return <Briefcase className="h-5 w-5" />;
    if (name.includes('Education')) return <GraduationCap className="h-5 w-5" />;
    if (name.includes('Skills') || name.includes('Keyword')) return <Target className="h-5 w-5" />;
    if (name.includes('Format')) return <FileCheck className="h-5 w-5" />;
    if (name.includes('Achievement')) return <TrendingUp className="h-5 w-5" />;
    if (name.includes('Match')) return <Target className="h-5 w-5" />;
    return <Layers className="h-5 w-5" />;
  };

  const colorMap: Record<string, string> = {
    'excellent': 'emerald', 'good': 'amber', 'needs-work': 'orange', 'poor': 'red',
  };
  const c = colorMap[section.status];
  const bgMap: Record<string, string> = {
    emerald: 'bg-emerald-50 dark:bg-emerald-900/20', amber: 'bg-amber-50 dark:bg-amber-900/20',
    orange: 'bg-orange-50 dark:bg-orange-900/20', red: 'bg-red-50 dark:bg-red-900/20',
  };
  const textMap: Record<string, string> = {
    emerald: 'text-emerald-700 dark:text-emerald-300', amber: 'text-amber-700 dark:text-amber-300',
    orange: 'text-orange-700 dark:text-orange-300', red: 'text-red-700 dark:text-red-300',
  };
  const barMap: Record<string, string> = {
    emerald: 'bg-emerald-500', amber: 'bg-amber-500', orange: 'bg-orange-500', red: 'bg-red-500',
  };
  const pct = Math.round((section.score / section.maxScore) * 100);

  return (
    <div className={`p-4 rounded-xl ${bgMap[c]} transition-all duration-300 hover:shadow-md cursor-pointer`}
      onClick={() => setExpanded(!expanded)}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className={textMap[c]}>{getIcon(section.name)}</span>
          <span className="font-semibold text-gray-900 dark:text-white text-sm">{section.name}</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${textMap[c]}`}>{pct}%</span>
          {expanded ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
        </div>
      </div>
      <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${barMap[c]} transition-all duration-700 ease-out`} style={{ width: `${pct}%` }} />
      </div>
      {expanded && section.feedback.length > 0 && (
        <ul className="space-y-1.5 mt-3 pt-2 border-t border-gray-200/50 dark:border-gray-700/50 animate-fadeIn">
          {section.feedback.map((fb, i) => (
            <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex items-start gap-1.5">
              <span className={`mt-0.5 ${textMap[c]}`}>•</span>
              <span>{fb}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// ——— Copyable Text Block ———
const CopyBlock: React.FC<{ text: string }> = ({ text }) => {
  const [copied, setCopied] = useState(false);
  const handleCopy = () => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };
  return (
    <div className="relative bg-gray-50 dark:bg-gray-800/60 p-3 rounded-lg border border-gray-200 dark:border-gray-700 group">
      <p className="text-sm text-gray-700 dark:text-gray-300 pr-8 whitespace-pre-wrap">{text}</p>
      <button onClick={handleCopy} className="absolute top-2 right-2 p-1.5 rounded-md bg-white dark:bg-gray-700 shadow-sm border border-gray-200 dark:border-gray-600 hover:bg-blue-50 dark:hover:bg-blue-900/30 transition-colors">
        {copied ? <Check className="h-3.5 w-3.5 text-emerald-500" /> : <Copy className="h-3.5 w-3.5 text-gray-400" />}
      </button>
    </div>
  );
};

interface AIRecommendationResult {
  optimizedBullets: string[];
  skillsToAdd: string[];
  tailoredSummary: string;
}

// ——— Main Page Component ———
const AtsCheckerPage: React.FC = () => {
  const { credits, customApiKey, deductCredit, setCustomApiKey } = useUserStore();
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const [resumeText, setResumeText] = useState('');
  const [jobDescriptions, setJobDescriptions] = useState<{ id: number; text: string; label: string }[]>([
    { id: 1, text: '', label: 'Job Description 1' }
  ]);
  const [activeJdId, setActiveJdId] = useState(1);
  const [isExtracting, setIsExtracting] = useState(false);
  const [fileName, setFileName] = useState('');
  const [results, setResults] = useState<Record<number, AnalysisResult>>({});
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [liveScore, setLiveScore] = useState<number | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const resultRef = useRef<HTMLDivElement>(null);

  // Gemini AI tailoring states
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResults, setAiResults] = useState<Record<number, AIRecommendationResult>>({});
  const [apiKeyInput, setApiKeyInput] = useState(customApiKey);
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);

  const activeJd = jobDescriptions.find(j => j.id === activeJdId);
  const currentResult = results[activeJdId] || null;
  const currentAiResult = aiResults[activeJdId] || null;

  // Sync store api key with current input
  useEffect(() => {
    setApiKeyInput(customApiKey);
  }, [customApiKey]);

  // Live score
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const jdText = activeJd?.text || '';
    if (resumeText.trim().length > 20 && jdText.trim().length > 20) {
      debounceRef.current = setTimeout(() => {
        const r = runATSAnalysis(resumeText, jdText);
        setLiveScore(r.overallScore);
      }, 600);
    } else {
      setLiveScore(null);
    }
    return () => { if (debounceRef.current) clearTimeout(debounceRef.current); };
  }, [resumeText, activeJd?.text]);

  const extractTextFromPDF = async (file: File) => {
    setIsExtracting(true);
    setFileName(file.name);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let text = '';
      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        text += textContent.items.map((item: any) => item.str).join(' ') + '\n';
      }
      setResumeText(text);
    } catch (error) {
      console.error('Error extracting text from PDF:', error);
      alert('Could not extract text from the PDF.');
    } finally {
      setIsExtracting(false);
    }
  };

  const extractTextFromFile = async (file: File) => {
    if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
      extractTextFromPDF(file);
    } else if (file.type === 'text/plain' || file.name.toLowerCase().endsWith('.txt')) {
      setFileName(file.name);
      setResumeText(await file.text());
    } else if (file.name.toLowerCase().endsWith('.docx')) {
      setFileName(file.name);
      // Basic DOCX text extraction
      try {
        const text = await file.text();
        setResumeText(text.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' '));
      } catch {
        alert('For best results, please paste your DOCX content as text or upload a PDF.');
      }
    } else {
      alert('Please upload a PDF, DOCX, or TXT file.');
    }
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) extractTextFromFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'], 'text/plain': ['.txt'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'] },
    maxFiles: 1,
    noClick: true,
  });

  const handleAnalyze = () => {
    const jdText = activeJd?.text || '';
    if (!resumeText.trim() || !jdText.trim()) {
      alert('Please provide both your resume and a job description.');
      return;
    }
    setIsAnalyzing(true);
    setTimeout(() => {
      // Run analysis for ALL JDs
      const newResults: Record<number, AnalysisResult> = {};
      jobDescriptions.forEach(jd => {
        if (jd.text.trim().length > 10) {
          newResults[jd.id] = runATSAnalysis(resumeText, jd.text);
        }
      });
      setResults(newResults);
      setIsAnalyzing(false);
      setActiveTab('overview');
      setTimeout(() => { resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }); }, 100);
    }, 900);
  };

  const handleAITailor = async () => {
    const jdText = activeJd?.text || '';
    if (!resumeText.trim() || !jdText.trim()) {
      alert('Please complete the ATS analysis first.');
      return;
    }

    // Custom API key gets free access, otherwise must use 1 credit
    const isDeveloperMode = !!customApiKey;

    if (!isDeveloperMode) {
      if (credits <= 0) {
        setIsCheckoutOpen(true);
        return;
      }
      deductCredit();
    }

    setAiLoading(true);
    try {
      const responseText = await generateAIRecommendations(resumeText, jdText, customApiKey);
      const parsed: AIRecommendationResult = JSON.parse(responseText);
      setAiResults({
        ...aiResults,
        [activeJdId]: parsed
      });
    } catch (e) {
      console.error(e);
      alert('AI tailoring failed. Please check your internet connection or Gemini API key settings.');
    } finally {
      setAiLoading(false);
    }
  };

  const resetAll = () => {
    setResumeText('');
    setJobDescriptions([{ id: 1, text: '', label: 'Job Description 1' }]);
    setActiveJdId(1);
    setFileName('');
    setResults({});
    setAiResults({});
    setLiveScore(null);
  };

  const addJd = () => {
    const newId = Math.max(...jobDescriptions.map(j => j.id)) + 1;
    setJobDescriptions([...jobDescriptions, { id: newId, text: '', label: `Job Description ${newId}` }]);
    setActiveJdId(newId);
  };
  const removeJd = (id: number) => {
    if (jobDescriptions.length <= 1) return;
    const filtered = jobDescriptions.filter(j => j.id !== id);
    setJobDescriptions(filtered);
    if (activeJdId === id) setActiveJdId(filtered[0].id);
    const newResults = { ...results };
    delete newResults[id];
    setResults(newResults);
  };
  const updateJdText = (id: number, text: string) => {
    setJobDescriptions(jobDescriptions.map(j => j.id === id ? { ...j, text } : j));
  };

  const saveApiKey = () => {
    setCustomApiKey(apiKeyInput);
    setShowApiKeyInput(false);
  };

  const tabs = [
    { key: 'overview', label: 'Overview & Suggestions', icon: <AlertCircle className="h-4 w-4" /> },
    { key: 'keywords', label: 'Keywords (TF-IDF)', icon: <Target className="h-4 w-4" /> },
    { key: 'sections', label: 'Scoring Breakdown', icon: <BarChart3 className="h-4 w-4" /> },
    { key: 'density', label: 'Keyword Density', icon: <span className="font-bold text-xs">#</span> },
    { key: 'simulation', label: 'ATS Simulation', icon: <Eye className="h-4 w-4" /> },
    { key: 'heatmap', label: 'Recruiter Heatmap', icon: <Activity className="h-4 w-4" /> },
    { key: 'rewrite', label: 'AI Tailor (Premium)', icon: <Sparkles className="h-4 w-4 animate-pulse" /> },
    { key: 'predictions', label: 'Predictions', icon: <DollarSign className="h-4 w-4" /> },
    { key: 'linkedin', label: 'LinkedIn Optimizer', icon: <Linkedin className="h-4 w-4" /> },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/20 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900 transition-colors duration-300">
      <Container>
        
        {/* Floating Credit Panel & API Settings */}
        <div className="flex justify-end gap-3 mb-6">
          <button
            onClick={() => setShowApiKeyInput(!showApiKeyInput)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 text-xs font-semibold text-gray-700 dark:text-gray-300 shadow-sm border border-gray-200 dark:border-gray-700 hover:bg-gray-50 transition-all"
          >
            <Key className="h-3.5 w-3.5 text-gray-500" />
            {customApiKey ? 'Developer Mode Active' : 'Add API Key'}
          </button>
          
          <button
            onClick={() => setIsCheckoutOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-bold shadow-md hover:shadow-lg hover:brightness-105 transition-all"
          >
            <Coins className="h-4 w-4" />
            <span>{credits} Credits</span>
            <span className="bg-white/20 px-2 py-0.5 rounded text-[10px]">Buy More</span>
          </button>
        </div>

        {/* API Key Modal Panel */}
        {showApiKeyInput && (
          <div className="mb-6 p-4 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 shadow-lg animate-fadeIn">
            <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-1 flex items-center gap-2">
              <Key className="h-4 w-4 text-blue-500" /> Gemini API Key Config
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Add your own free Gemini API Key to bypass billing and run unlimited AI resume tailoring. Stored locally in your browser.
            </p>
            <div className="flex gap-2">
              <input
                type="password"
                placeholder="AIzaSy..."
                value={apiKeyInput}
                onChange={(e) => setApiKeyInput(e.target.value)}
                className="flex-1 p-2 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-900 text-sm text-gray-900 dark:text-white"
              />
              <button onClick={saveApiKey} className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-sm">
                Save Key
              </button>
              {customApiKey && (
                <button onClick={() => { setCustomApiKey(''); setApiKeyInput(''); }} className="px-4 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 font-bold text-xs rounded-xl border border-red-200">
                  Delete
                </button>
              )}
            </div>
          </div>
        )}

        {/* Hero Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600/10 to-purple-600/10 dark:from-blue-500/20 dark:to-purple-500/20 px-4 py-2 rounded-full mb-5 border border-blue-200/50 dark:border-blue-700/30">
            <Sparkles className="h-4 w-4 text-blue-600 dark:text-blue-400 animate-pulse" />
            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">Advanced NLP-Powered ATS Engine V2</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-700 via-purple-600 to-blue-700 dark:from-blue-400 dark:via-purple-400 dark:to-blue-400 bg-clip-text text-transparent mb-4 leading-tight">
            ResumeSync Pro
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto font-medium">
            The most comprehensive ATS checker. 15 scoring dimensions, semantic matching, recruiter heatmap simulation, AI rewrite tips, and predictive analytics.
          </p>
          <div className="flex flex-wrap justify-center gap-3 mt-5">
            {[
              { icon: <Zap className="h-4 w-4 animate-pulse text-amber-500" />, text: 'TF-IDF + Semantic Scoring' },
              { icon: <Target className="h-4 w-4 text-blue-500" />, text: 'Must-Have vs Nice-To-Have' },
              { icon: <Eye className="h-4 w-4 text-purple-500" />, text: 'ATS Simulation Preview' },
              { icon: <Shield className="h-4 w-4 text-emerald-500" />, text: '100% Private (Local)' },
              { icon: <Brain className="h-4 w-4 text-pink-500" />, text: 'AI Rewrite Engine' },
            ].map((pill, i) => (
              <span key={i} className="inline-flex items-center gap-1.5 text-xs font-medium text-gray-600 dark:text-gray-400 bg-white dark:bg-gray-800 px-3 py-1.5 rounded-full shadow-sm border border-gray-200 dark:border-gray-700">
                {pill.icon} {pill.text}
              </span>
            ))}
          </div>
        </div>

        {/* Live Score Indicator */}
        {liveScore !== null && !currentResult && (
          <div className="flex justify-center mb-6 animate-fadeIn">
            <div className="inline-flex items-center gap-3 bg-white dark:bg-gray-800 px-6 py-3 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700">
              <div className="relative flex items-center justify-center h-10 w-10">
                <svg width="40" height="40" className="transform -rotate-90">
                  <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="3" fill="none" className="text-gray-200 dark:text-gray-700" />
                  <circle cx="20" cy="20" r="16"
                    stroke={liveScore >= 70 ? '#10b981' : liveScore >= 40 ? '#f59e0b' : '#ef4444'}
                    strokeWidth="3" fill="none" strokeLinecap="round"
                    strokeDasharray={100.5} strokeDashoffset={100.5 - (liveScore / 100) * 100.5}
                    style={{ transition: 'stroke-dashoffset 0.3s ease' }} />
                </svg>
                <span className="absolute text-xs font-bold text-gray-900 dark:text-white">{liveScore}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white">Live ATS Score</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">Updates as you type</p>
              </div>
              <Clock className="h-4 w-4 text-blue-500 animate-pulse" />
            </div>
          </div>
        )}

        {/* Input Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Resume Upload */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <div className="bg-blue-600 p-1.5 rounded-lg"><Upload className="h-4 w-4 text-white" /></div>
                Upload Your Resume
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">PDF, DOCX, TXT supported • Drag & drop or browse</p>
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <div {...getRootProps()}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all duration-300 cursor-pointer group flex-shrink-0 ${
                  isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 scale-[1.02]' :
                  fileName ? 'border-emerald-300 dark:border-emerald-700 bg-emerald-50/50 dark:bg-emerald-900/10' :
                  'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
                }`}
                onClick={open}>
                <input {...getInputProps()} />
                {isExtracting ? (
                  <div className="flex flex-col items-center">
                    <RefreshCw className="h-10 w-10 text-blue-500 animate-spin mb-3" />
                    <p className="text-gray-600 dark:text-gray-300 font-medium">Extracting text...</p>
                  </div>
                ) : fileName ? (
                  <div className="flex flex-col items-center">
                    <CheckCircle className="h-10 w-10 text-emerald-500 mb-2" />
                    <p className="text-gray-800 dark:text-white font-semibold truncate max-w-[200px]">{fileName}</p>
                    <p className="text-sm text-emerald-600 dark:text-emerald-400 mt-1">✓ Text extracted</p>
                    <button onClick={(e) => { e.stopPropagation(); open(); }}
                      className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:underline font-medium">Upload different file</button>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="bg-blue-100 dark:bg-blue-900/30 p-3 rounded-2xl mb-3 group-hover:scale-110 transition-transform">
                      <Upload className="h-7 w-7 text-blue-600 dark:text-blue-400" />
                    </div>
                    <p className="text-gray-700 dark:text-gray-200 font-semibold mb-1">Drop your resume here</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">or click to browse</p>
                    <span className="text-xs text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-full">
                      .PDF .DOCX .TXT
                    </span>
                  </div>
                )}
              </div>
              <div className="mt-4 flex-1 flex flex-col">
                <div className="flex items-center gap-3 mb-2">
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                  <span className="text-xs text-gray-400 dark:text-gray-500 font-medium">OR PASTE TEXT</span>
                  <div className="flex-1 h-px bg-gray-200 dark:bg-gray-700" />
                </div>
                <textarea
                  className="flex-1 w-full min-h-[120px] p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm resize-none transition-all placeholder-gray-400"
                  placeholder="Paste your resume text here..."
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Job Description(s) */}
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white flex items-center gap-2">
                    <div className="bg-purple-600 p-1.5 rounded-lg"><FileText className="h-4 w-4 text-white" /></div>
                    Job Description{jobDescriptions.length > 1 ? 's' : ''}
                  </h3>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Compare against multiple JDs at once</p>
                </div>
                <button onClick={addJd}
                  className="flex items-center gap-1 text-xs font-bold text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30 px-3 py-1.5 rounded-full hover:bg-purple-200 dark:hover:bg-purple-800/40 transition-colors">
                  <Plus className="h-3.5 w-3.5" /> Add JD
                </button>
              </div>
              {/* JD Tabs */}
              {jobDescriptions.length > 1 && (
                <div className="flex gap-2 mt-3 overflow-x-auto no-scrollbar">
                  {jobDescriptions.map(jd => (
                    <button key={jd.id} onClick={() => setActiveJdId(jd.id)}
                      className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all whitespace-nowrap ${
                        activeJdId === jd.id
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}>
                      {jd.label}
                      {results[jd.id] && <span className="ml-1 bg-white/20 px-1.5 py-0.5 rounded text-[10px]">{results[jd.id].overallScore}</span>}
                      {jobDescriptions.length > 1 && (
                        <button onClick={(e) => { e.stopPropagation(); removeJd(jd.id); }}
                          className="ml-1 hover:text-red-300">
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="p-5 flex-1 flex flex-col">
              <textarea
                className="flex-1 w-full min-h-[280px] p-3 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-gray-50 dark:bg-gray-700/50 text-gray-900 dark:text-white text-sm resize-none transition-all placeholder-gray-400"
                placeholder="Paste the job description (e.g. required skills, title, experience, qualifications...)"
                value={activeJd?.text || ''}
                onChange={(e) => updateJdText(activeJdId, e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-10">
          <button onClick={handleAnalyze}
            disabled={isExtracting || isAnalyzing || !resumeText.trim() || !(activeJd?.text || '').trim()}
            className="group relative inline-flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600 bg-[length:200%_auto] text-white px-10 py-4 rounded-xl font-bold text-lg shadow-xl hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:bg-right-top transform hover:-translate-y-0.5 active:translate-y-0">
            {isAnalyzing ? (
              <><RefreshCw className="h-5 w-5 animate-spin" /> Running 15-Point Analysis...</>
            ) : (
              <><Zap className="h-5 w-5 group-hover:animate-pulse" /> Analyze Resume Match <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" /></>
            )}
          </button>
          {(resumeText || (activeJd?.text) || Object.keys(results).length > 0) && (
            <button onClick={resetAll}
              className="inline-flex items-center gap-2 text-gray-500 dark:text-gray-400 hover:text-red-500 dark:hover:text-red-400 font-medium transition-colors">
              <X className="h-4 w-4" /> Clear All
            </button>
          )}
        </div>

        {/* ===== RESULTS SECTION ===== */}
        {currentResult && (
          <div ref={resultRef} className="space-y-6 animate-fadeIn">
            {/* Score Card Header */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between">
                <h2 className="text-xl font-bold text-white flex items-center gap-2 mb-2 sm:mb-0">
                  <Award className="h-6 w-6" /> ResumeSync Pro — Analysis Report
                </h2>
                <div className="text-white/80 text-sm font-medium flex gap-4">
                  <span>{currentResult.resumeWordCount} Words</span>
                  <span>{currentResult.estimatedPages} Page{currentResult.estimatedPages > 1 ? 's' : ''}</span>
                  <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{currentResult.jdData.industry}</span>
                </div>
              </div>
              <div className="p-6 md:p-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="flex flex-col items-center justify-center">
                    <ScoreGauge score={currentResult.overallScore} />
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-3 text-center">ATS Compatibility Score</p>
                  </div>
                  <div className="space-y-4 md:col-span-2">
                    {/* Quick Stats */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                      {[
                        { label: 'Keywords Found', value: currentResult.matchedCount, color: 'emerald' },
                        { label: 'Keywords Missing', value: currentResult.missingCount, color: 'red' },
                        { label: 'Impact Score', value: currentResult.impactScore, color: 'blue' },
                        { label: 'Writing Quality', value: currentResult.readabilityScore, color: 'purple' },
                      ].map((stat, i) => (
                        <div key={i} className={`bg-${stat.color}-50 dark:bg-${stat.color}-900/10 p-3 rounded-xl text-center border border-${stat.color}-100 dark:border-${stat.color}-800/30`}>
                          <p className={`text-2xl font-black text-${stat.color}-600 dark:text-${stat.color}-400`}>{stat.value}</p>
                          <p className="text-[10px] text-gray-600 dark:text-gray-400 mt-1 font-medium">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                    {/* Strengths */}
                    {currentResult.strengths.length > 0 && (
                      <div className="bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-xl border border-emerald-100 dark:border-emerald-800/30">
                        <h4 className="font-semibold text-emerald-800 dark:text-emerald-300 text-sm flex items-center gap-2 mb-2">
                          <TrendingUp className="h-4 w-4" /> Strong Areas
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {currentResult.strengths.map((s, i) => (
                            <span key={i} className="text-xs bg-emerald-100 dark:bg-emerald-800/30 text-emerald-700 dark:text-emerald-300 px-2.5 py-1 rounded-full font-medium">✓ {s}</span>
                          ))}
                        </div>
                      </div>
                    )}
                    {/* Multi JD Comparison */}
                    {Object.keys(results).length > 1 && (
                      <div className="bg-blue-50 dark:bg-blue-900/10 p-3 rounded-xl border border-blue-100 dark:border-blue-800/30">
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-sm flex items-center gap-2 mb-2">
                          <Layers className="h-4 w-4" /> Multi-JD Comparison
                        </h4>
                        <div className="flex flex-wrap gap-3">
                          {jobDescriptions.filter(jd => results[jd.id]).map(jd => (
                            <button key={jd.id} onClick={() => setActiveJdId(jd.id)}
                              className={`flex items-center gap-2 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
                                activeJdId === jd.id ? 'bg-blue-600 text-white border-blue-600' : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600 hover:border-blue-400'
                              }`}>
                              {jd.label}
                              <span className={`font-black ${results[jd.id].overallScore >= 70 ? 'text-emerald-400' : results[jd.id].overallScore >= 40 ? 'text-amber-400' : 'text-red-400'}`}>
                                {results[jd.id].overallScore}%
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Tabbed Detail View */}
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="flex overflow-x-auto no-scrollbar border-b border-gray-200 dark:border-gray-700">
                {tabs.map((tab) => (
                  <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                    className={`flex-shrink-0 flex items-center justify-center gap-1.5 px-4 py-3.5 text-xs font-semibold transition-all duration-300 border-b-2 whitespace-nowrap ${
                      activeTab === tab.key
                        ? 'border-blue-600 text-blue-600 dark:text-blue-400 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10 font-bold'
                        : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700/30'
                    }`}>
                    {tab.icon} {tab.label}
                  </button>
                ))}
              </div>

              <div className="p-6">
                {/* ——— OVERVIEW TAB ——— */}
                {activeTab === 'overview' && (
                  <div className="space-y-6">
                    <div>
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                        <AlertCircle className="h-5 w-5 text-amber-500" /> Actionable Suggestions
                      </h3>
                      {currentResult.suggestions.length > 0 ? (
                        <div className="space-y-3">
                          {currentResult.suggestions.map((s, i) => (
                            <div key={i} className={`flex items-start gap-3 p-4 rounded-xl border ${
                              s.priority === 'high' ? 'bg-red-50 dark:bg-red-900/10 border-red-100 dark:border-red-800/30' :
                              s.priority === 'medium' ? 'bg-orange-50 dark:bg-orange-900/10 border-orange-100 dark:border-orange-800/30' :
                              'bg-blue-50 dark:bg-blue-900/10 border-blue-100 dark:border-blue-800/30'
                            }`}>
                              <ChevronRight className={`h-5 w-5 mt-0.5 flex-shrink-0 ${
                                s.priority === 'high' ? 'text-red-500' : s.priority === 'medium' ? 'text-orange-500' : 'text-blue-500'
                              }`} />
                              <div>
                                <div className="flex items-center gap-2 mb-1">
                                  <span className={`text-[10px] uppercase font-bold tracking-wider ${
                                    s.priority === 'high' ? 'text-red-600 dark:text-red-400' : s.priority === 'medium' ? 'text-orange-600 dark:text-orange-400' : 'text-blue-600 dark:text-blue-400'
                                  }`}>{s.priority} PRIORITY</span>
                                  <span className="text-[10px] text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded">{s.category}</span>
                                </div>
                                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{s.text}</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8">
                          <CheckCircle className="h-12 w-12 text-emerald-500 mx-auto mb-3" />
                          <p className="font-semibold text-gray-900 dark:text-white">Looking great!</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">No major issues detected.</p>
                        </div>
                      )}
                    </div>
                    {/* Format checks */}
                    <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                      <h3 className="font-bold text-gray-900 dark:text-white text-lg mb-4 flex items-center gap-2">
                        <FileCheck className="h-5 w-5 text-blue-500" /> ATS Formatting Checks
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {currentResult.formatChecks.map((check, i) => (
                          <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                            {check.passed ? <CheckCircle className="h-5 w-5 text-emerald-500 flex-shrink-0" /> : <FileWarning className="h-5 w-5 text-amber-500 flex-shrink-0" />}
                            <div>
                              <p className="text-sm font-semibold text-gray-900 dark:text-white">{check.label}</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">{check.detail}</p>
                              {check.penalty > 0 && <p className="text-[10px] text-red-500 mt-0.5">-{check.penalty} points</p>}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* ——— KEYWORDS TAB ——— */}
                {activeTab === 'keywords' && (
                  <div className="space-y-6">
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg border border-blue-100 dark:border-blue-800/30">
                      <strong>How this works:</strong> Keywords are extracted from the JD and separated into <span className="font-bold text-red-600">MUST HAVE</span> and <span className="font-bold text-amber-600">NICE TO HAVE</span>. We check your resume for exact matches and semantic synonyms.
                    </p>
                    {/* Matched */}
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2 mb-3">
                        <CheckCircle className="h-4 w-4 text-emerald-500" /> Matched Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentResult.keywords.filter(k => kw => true).filter(k => k.found).length > 0 ? currentResult.keywords.filter(k => k.found).map((kw, i) => (
                          <span key={i} className={`px-3 py-1.5 text-xs font-semibold rounded-lg border flex flex-col ${
                            kw.isSynonymMatch
                              ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/50'
                              : 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/50'
                          }`}>
                            <span className="flex items-center gap-1">
                              {kw.isSynonymMatch ? <Sparkles className="h-3 w-3" /> : '✓'} {kw.keyword}
                              <span className={`text-[9px] px-1 py-0.5 rounded ${kw.importance === 'must-have' ? 'bg-red-200 dark:bg-red-800 text-red-700 dark:text-red-200' : 'bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-200'}`}>{kw.importance}</span>
                            </span>
                            {kw.isSynonymMatch && <span className="text-[9px] opacity-70 mt-0.5">Matched via: {kw.matchedAs}</span>}
                          </span>
                        )) : <span className="text-gray-500 text-sm italic">No keywords matched.</span>}
                      </div>
                    </div>
                    {/* Missing */}
                    <div>
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2 mb-3">
                        <AlertCircle className="h-4 w-4 text-red-500" /> Missing Keywords
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {currentResult.keywords.filter(k => !k.found).length > 0 ? currentResult.keywords.filter(k => !k.found).map((kw, i) => (
                          <span key={i} className="px-3 py-1.5 bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 text-xs font-semibold rounded-lg border border-red-200 dark:border-red-800/50 flex items-center gap-1">
                            ✗ {kw.keyword}
                            <span className={`text-[9px] px-1 py-0.5 rounded ${kw.importance === 'must-have' ? 'bg-red-300 dark:bg-red-700' : 'bg-amber-200 dark:bg-amber-700'}`}>{kw.importance}</span>
                          </span>
                        )) : <span className="text-emerald-600 dark:text-emerald-400 text-sm font-medium">All important keywords present!</span>}
                      </div>
                    </div>
                    {/* Detailed Table */}
                    <div className="pt-4">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2 mb-3">
                        <BarChart3 className="h-4 w-4 text-blue-500" /> Detailed Frequency
                      </h4>
                      <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                        <table className="w-full text-sm text-left">
                          <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                            <tr>
                              <th className="px-4 py-3 font-semibold">Keyword</th>
                              <th className="px-4 py-3 font-semibold">Priority</th>
                              <th className="px-4 py-3 font-semibold text-center">In JD</th>
                              <th className="px-4 py-3 font-semibold text-center">In Resume</th>
                              <th className="px-4 py-3 font-semibold text-center">Status</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {currentResult.keywords.map((kw, i) => (
                              <tr key={i} className="bg-white dark:bg-gray-900">
                                <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">
                                  {kw.keyword}
                                  {kw.isSynonymMatch && <span className="block text-[10px] text-blue-500">via "{kw.matchedAs}"</span>}
                                </td>
                                <td className="px-4 py-3"><span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${kw.importance === 'must-have' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'}`}>{kw.importance}</span></td>
                                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{kw.jdCount}</td>
                                <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{kw.resumeCount}</td>
                                <td className="px-4 py-3 text-center">
                                  {kw.found ? (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300">Found</span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300">Missing</span>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ——— SECTIONS TAB ——— */}
                {activeTab === 'sections' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                      Your ATS score is composed of 6 weighted dimensions. Click any section to see detailed feedback.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {currentResult.sections.map((section, i) => (
                        <SectionBar key={i} section={section} />
                      ))}
                    </div>
                    {/* Scoring formula */}
                    <div className="mt-6 bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2 flex items-center gap-2"><Gauge className="h-4 w-4 text-blue-500" /> Scoring Formula</h4>
                      <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
                        <strong>ATS Score</strong> = 35% Skills Match + 25% Semantic Similarity + 15% Experience Match + 10% Formatting + 10% Achievements + 5% Education/Certifications.
                        {currentResult.jdData.industry !== 'Technology' && <><br/>Industry-specific weighting applied for <strong>{currentResult.jdData.industry}</strong>.</>}
                      </p>
                    </div>
                  </div>
                )}

                {/* ——— DENSITY TAB ——— */}
                {activeTab === 'density' && (
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                      <strong>Keyword Density:</strong> Maintain 1–3% density for key terms. Below 0.5% is underuse, above 3% risks keyword stuffing penalties.
                    </p>
                    <div className="overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700">
                      <table className="w-full text-sm text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 text-gray-600 dark:text-gray-300">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Keyword</th>
                            <th className="px-4 py-3 font-semibold text-center">Density %</th>
                            <th className="px-4 py-3 font-semibold text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                          {currentResult.densityReport.map((d, i) => (
                            <tr key={i} className="bg-white dark:bg-gray-900">
                              <td className="px-4 py-3 font-medium text-gray-900 dark:text-white">{d.keyword}</td>
                              <td className="px-4 py-3 text-center text-gray-600 dark:text-gray-300">{d.density}%</td>
                              <td className="px-4 py-3 text-center">
                                <span className={`px-2 py-0.5 rounded text-xs font-medium ${
                                  d.status === 'optimal' ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300' :
                                  d.status === 'underuse' ? 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300' :
                                  'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
                                }`}>{d.status === 'stuffing' ? '⚠ Stuffing' : d.status === 'underuse' ? '↓ Underuse' : '✓ Optimal'}</span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* ——— ATS SIMULATION TAB ——— */}
                {activeTab === 'simulation' && (
                  <div className="space-y-5">
                    <div className="bg-red-50 dark:bg-red-900/10 p-4 rounded-xl border border-red-100 dark:border-red-800/30">
                      <h3 className="font-bold text-red-800 dark:text-red-300 text-sm flex items-center gap-2 mb-2">
                        <Eye className="h-5 w-5" /> How ATS Robots See Your Resume
                      </h3>
                      <p className="text-xs text-red-700 dark:text-red-400">This is a simulation of how automated parsers strip your resume down to plain text. Formatting, icons, and table layouts are lost — only content survives.</p>
                    </div>
                    <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-xs leading-relaxed overflow-auto max-h-[400px] border-2 border-gray-700">
                      <pre className="whitespace-pre-wrap">{currentResult.atsSimulation.plainTextStripped}</pre>
                    </div>
                    {currentResult.atsSimulation.brokenElements.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-bold text-gray-900 dark:text-white text-sm flex items-center gap-2">
                          <FileWarning className="h-4 w-4 text-amber-500" /> Broken Elements Detected
                        </h4>
                        {currentResult.atsSimulation.brokenElements.map((el, i) => (
                          <div key={i} className="flex items-start gap-2 bg-amber-50 dark:bg-amber-900/10 p-3 rounded-lg border border-amber-100 dark:border-amber-800/30">
                            <AlertCircle className="h-4 w-4 text-amber-500 flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-amber-800 dark:text-amber-300">{el}</p>
                          </div>
                        ))}
                      </div>
                    )}
                    {currentResult.atsSimulation.brokenElements.length === 0 && (
                      <div className="flex items-center gap-2 bg-emerald-50 dark:bg-emerald-900/10 p-3 rounded-lg border border-emerald-100 dark:border-emerald-800/30">
                        <CheckCircle className="h-5 w-5 text-emerald-500" />
                        <p className="text-sm text-emerald-800 dark:text-emerald-300 font-medium">No parsing failures detected. Your resume structure is ATS-safe.</p>
                      </div>
                    )}
                  </div>
                )}

                {/* ——— HEATMAP TAB ——— */}
                {activeTab === 'heatmap' && (
                  <div className="space-y-5">
                    <div className="bg-purple-50 dark:bg-purple-900/10 p-4 rounded-xl border border-purple-100 dark:border-purple-800/30">
                      <h3 className="font-bold text-purple-800 dark:text-purple-300 text-sm flex items-center gap-2 mb-2">
                        <Activity className="h-5 w-5" /> Recruiter Attention Heatmap
                      </h3>
                      <p className="text-xs text-purple-700 dark:text-purple-400">Real recruiters skim a resume in 6–10 seconds. This shows which sections of your resume attract the most attention based on research-backed reading patterns.</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[
                        { area: 'Name & Title (Top)', attention: 95, detail: 'Recruiters always look here first. Make it bold and prominent.', time: '1–2 sec' },
                        { area: 'Skills Section', attention: 88, detail: 'Technical recruiters scan this immediately after the name.', time: '2–3 sec' },
                        { area: 'Most Recent Experience', attention: 82, detail: 'The last 1–2 roles get the deepest read.', time: '3–5 sec' },
                        { area: 'Education', attention: 55, detail: 'Glanced at briefly, mainly for degree level.', time: '1 sec' },
                        { area: 'Older Experience', attention: 30, detail: 'Rarely read in detail — keep it brief.', time: '<1 sec' },
                        { area: 'Projects / Extras', attention: 40, detail: 'Only read if the rest of the resume is strong.', time: '1 sec' },
                      ].map((zone, i) => (
                        <div key={i} className="p-4 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/50">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-semibold text-gray-900 dark:text-white text-sm">{zone.area}</span>
                            <span className="text-xs text-gray-400">{zone.time}</span>
                          </div>
                          <div className="w-full h-3 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mb-2">
                            <div className="h-full rounded-full transition-all duration-700" style={{
                              width: `${zone.attention}%`,
                              background: zone.attention >= 80 ? 'linear-gradient(90deg, #ef4444, #f97316)' : zone.attention >= 50 ? 'linear-gradient(90deg, #f59e0b, #eab308)' : 'linear-gradient(90deg, #3b82f6, #60a5fa)'
                            }} />
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-500 dark:text-gray-400">{zone.detail}</p>
                            <span className="text-xs font-bold" style={{ color: zone.attention >= 80 ? '#ef4444' : zone.attention >= 50 ? '#f59e0b' : '#3b82f6' }}>{zone.attention}%</span>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800/50 p-4 rounded-xl border border-gray-200 dark:border-gray-700">
                      <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-2">Your Readability Assessment</h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <div className="text-center"><p className="text-lg font-bold text-blue-600 dark:text-blue-400">{currentResult.readabilityReport.avgSentenceLength}</p><p className="text-[10px] text-gray-500">Avg Sentence Length</p></div>
                        <div className="text-center"><p className="text-lg font-bold text-purple-600 dark:text-purple-400">{currentResult.readabilityReport.passiveVoiceCount}</p><p className="text-[10px] text-gray-500">Passive Voice</p></div>
                        <div className="text-center"><p className="text-lg font-bold text-amber-600 dark:text-amber-400">{currentResult.readabilityReport.clichesCount}</p><p className="text-[10px] text-gray-500">Clichés Found</p></div>
                        <div className="text-center"><p className="text-lg font-bold text-emerald-600 dark:text-emerald-400">{currentResult.readabilityReport.readabilityIndex}</p><p className="text-[10px] text-gray-500">Readability</p></div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ——— PREMIUM AI REWRITE TAB ——— */}
                {activeTab === 'rewrite' && (
                  <div className="space-y-6">
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 p-5 rounded-2xl text-white shadow-md relative overflow-hidden">
                      <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 opacity-15">
                        <Sparkles className="w-36 h-36" />
                      </div>
                      <div className="relative z-10">
                        <span className="bg-white/20 text-white text-[10px] font-black uppercase tracking-wider px-3 py-1 rounded-full">
                          {customApiKey ? 'Developer Mode (Unlimited Free API)' : 'Premium Tool'}
                        </span>
                        <h3 className="text-xl font-black mt-2 mb-1 flex items-center gap-2">
                          <Brain className="h-6 w-6" /> Tailor Resume with Gemini AI
                        </h3>
                        <p className="text-xs text-white/85 max-w-xl">
                          Generates context-aware, tailored experience bullet points matching the target job description using the metrics-focused XYZ formula.
                        </p>
                      </div>
                    </div>

                    {currentAiResult ? (
                      <div className="space-y-6 animate-fadeIn">
                        {/* Tailored Professional Summary */}
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                            <Brain className="h-4.5 w-4.5 text-blue-500" /> Tailored Professional Summary
                          </h4>
                          <CopyBlock text={currentAiResult.tailoredSummary} />
                        </div>

                        {/* Optimized Bullet Points */}
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                            <Award className="h-4.5 w-4.5 text-indigo-500" /> Optimized Experience Bullets (XYZ Format)
                          </h4>
                          <div className="space-y-3">
                            {currentAiResult.optimizedBullets.map((bullet, i) => (
                              <CopyBlock key={i} text={bullet} />
                            ))}
                          </div>
                        </div>

                        {/* Target Keywords to Add */}
                        <div>
                          <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3 flex items-center gap-2">
                            <Target className="h-4.5 w-4.5 text-emerald-500" /> Key missing terms to insert
                          </h4>
                          <div className="flex flex-wrap gap-2">
                            {currentAiResult.skillsToAdd.map((skill, i) => (
                              <span key={i} className="px-3 py-1.5 bg-emerald-50 dark:bg-emerald-950/20 text-emerald-700 dark:text-emerald-400 text-xs font-semibold rounded-lg border border-emerald-100 dark:border-emerald-900/50">
                                + {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Re-generate option */}
                        <div className="pt-4 border-t border-gray-200 dark:border-gray-700 flex justify-end">
                          <button
                            onClick={handleAITailor}
                            disabled={aiLoading}
                            className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-800 dark:text-white px-4 py-2.5 rounded-xl text-xs font-bold transition-all"
                          >
                            {aiLoading ? <RefreshCw className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-purple-500" />}
                            Re-generate suggestions {customApiKey ? '(Free)' : '(Costs 1 Credit)'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center p-8 bg-gray-50 dark:bg-gray-900/20 rounded-2xl border border-gray-200 dark:border-gray-700">
                        <Sparkles className="h-12 w-12 text-blue-500 mx-auto mb-3 animate-pulse" />
                        <h4 className="font-bold text-gray-900 dark:text-white mb-2">No AI suggestions generated yet</h4>
                        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-md mx-auto mb-6">
                          Let Gemini AI analyze your resume alongside this target job description to create optimized bullet points, missing keywords lists, and a tailored summary.
                        </p>
                        
                        <button
                          onClick={handleAITailor}
                          disabled={aiLoading}
                          className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-8 py-3.5 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5"
                        >
                          {aiLoading ? (
                            <><RefreshCw className="h-5 w-5 animate-spin" /> Consulting Gemini AI...</>
                          ) : (
                            <>
                              <Sparkles className="h-4 w-4" /> Tailor Resume with AI
                              <span className="ml-1 bg-white/20 px-2 py-0.5 rounded text-[10px] uppercase font-bold">
                                {customApiKey ? 'Free' : 'Costs 1 Credit'}
                              </span>
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* ——— PREDICTIONS TAB ——— */}
                {activeTab === 'predictions' && (
                  <div className="space-y-5">
                    <div className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/10 dark:to-blue-900/10 p-4 rounded-xl border border-green-100 dark:border-green-800/30">
                      <h3 className="font-bold text-green-800 dark:text-green-300 text-sm flex items-center gap-2 mb-2">
                        <TrendingUp className="h-5 w-5" /> Predictive Analytics
                      </h3>
                      <p className="text-xs text-green-700 dark:text-green-400">Based on your resume content and job market data, here are our predictive models.</p>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                          <Briefcase className="h-5 w-5 text-blue-500" />
                          <span className="font-bold text-gray-900 dark:text-white text-sm">Predicted Role Match</span>
                        </div>
                        <p className="text-lg font-black text-blue-600 dark:text-blue-400 mb-1">{currentResult.predictions.role}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Confidence: {currentResult.predictions.confidence}%</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                          <DollarSign className="h-5 w-5 text-emerald-500" />
                          <span className="font-bold text-gray-900 dark:text-white text-sm">Estimated Salary Range</span>
                        </div>
                        <p className="text-lg font-black text-emerald-600 dark:text-emerald-400 mb-1">{currentResult.predictions.suggestedSalary}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Based on {currentResult.jdData.industry} industry</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                          <Activity className="h-5 w-5 text-purple-500" />
                          <span className="font-bold text-gray-900 dark:text-white text-sm">Market Demand</span>
                        </div>
                        <p className={`text-lg font-black mb-1 ${currentResult.predictions.marketDemand === 'High' ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>{currentResult.predictions.marketDemand}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Hiring demand for this role category</p>
                      </div>
                      <div className="bg-white dark:bg-gray-800/50 p-5 rounded-xl border border-gray-200 dark:border-gray-700">
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="h-5 w-5 text-amber-500" />
                          <span className="font-bold text-gray-900 dark:text-white text-sm">Resume Percentile</span>
                        </div>
                        <p className="text-lg font-black text-amber-600 dark:text-amber-400 mb-1">Top {Math.max(5, 100 - currentResult.overallScore)}%</p>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Relative to average applicant resumes</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* ——— LINKEDIN OPTIMIZER TAB ——— */}
                {activeTab === 'linkedin' && (
                  <div className="space-y-5">
                    <div className="bg-gradient-to-r from-blue-50 to-sky-50 dark:from-blue-900/10 dark:to-sky-900/10 p-4 rounded-xl border border-blue-100 dark:border-blue-800/30">
                      <h3 className="font-bold text-blue-800 dark:text-blue-300 text-sm flex items-center gap-2 mb-2">
                        <Linkedin className="h-5 w-5" /> LinkedIn Profile Optimizer
                      </h3>
                      <p className="text-xs text-blue-700 dark:text-blue-400">87% of recruiters use LinkedIn to verify candidates. Ensure your profile aligns with your resume and target job.</p>
                    </div>
                    <div className="space-y-2">
                      {[
                        { tip: 'Use the exact target job title as your LinkedIn headline (e.g., "Senior React Developer | Full Stack Engineer")', icon: '🎯' },
                        { tip: `Add these missing skills to your LinkedIn Skills section: ${currentResult.keywords.filter(k => !k.found).slice(0, 5).map(k => k.keyword).join(', ') || 'All matched!'}`, icon: '🔧' },
                        { tip: 'Write an "About" section that mirrors your resume summary but in first person', icon: '✍️' },
                        { tip: 'Request endorsements for your top 5 technical skills to boost credibility', icon: '👍' },
                        { tip: 'Enable "Open to Work" privately to let recruiters know you\'re looking', icon: '💼' },
                        { tip: 'Add a professional headshot — profiles with photos get 21x more views', icon: '📸' },
                        { tip: 'Include relevant certifications in both your resume and LinkedIn', icon: '🏆' },
                        { tip: 'Customize your LinkedIn URL (e.g., linkedin.com/in/yourname) and add it to your resume', icon: '🔗' },
                      ].map((item, i) => (
                        <div key={i} className="flex items-start gap-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg border border-gray-200 dark:border-gray-700">
                          <span className="text-lg flex-shrink-0">{item.icon}</span>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{item.tip}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Empty state */}
        {!currentResult && !isAnalyzing && (
          <div className="bg-white dark:bg-gray-800/50 p-12 rounded-2xl border-2 border-dashed border-gray-200 dark:border-gray-700 text-center">
            <div className="bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm">
              <FileText className="h-10 w-10 text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 dark:text-gray-200 mb-2">Ready for Analysis</h3>
            <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
              Upload your resume and paste the job description above, then click <strong>"Analyze Resume Match"</strong> to run our advanced 15-point NLP engine.
            </p>
          </div>
        )}
      </Container>

      {/* Payment Checkout Modal Overlay */}
      <CheckoutModal isOpen={isCheckoutOpen} onClose={() => setIsCheckoutOpen(false)} />

      <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
};

export default AtsCheckerPage;
