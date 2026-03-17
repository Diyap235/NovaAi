// Centralized tool definitions — single source of truth used by Home, Dashboard, and Tools pages.
import writingToolIcon from '../assets/generated/writing-tool-icon.dim_64x64.png';
import grammarIcon from '../assets/generated/grammar-icon.dim_64x64.png';
import paraphraseIcon from '../assets/generated/paraphrase-icon.dim_64x64.png';
import summaryIcon from '../assets/generated/summary-icon.dim_64x64.png';
import toneIcon from '../assets/generated/tone-icon.dim_64x64.png';
import plagiarismIcon from '../assets/generated/plagiarism-icon.dim_64x64.png';
import citationIcon from '../assets/generated/citation-icon.dim_64x64.png';
import wordChoiceIcon from '../assets/generated/word-choice-icon.dim_64x64.png';
import sentenceIcon from '../assets/generated/sentence-icon.dim_64x64.png';
import readabilityIcon from '../assets/generated/readability-icon.dim_64x64.png';
import vocabularyIcon from '../assets/generated/vocabulary-icon.dim_64x64.png';
import styleGuideIcon from '../assets/generated/style-guide-icon.dim_64x64.png';

export const ALL_TOOLS = [
  { id: 'writing',     icon: writingToolIcon, title: 'AI Writing Assistant',  description: 'Get intelligent suggestions to improve your writing style, clarity, and impact.',          color: '#a855f7', path: '/dashboard/tools/writing-assistant' },
  { id: 'grammar',     icon: grammarIcon,     title: 'Grammar Checker',        description: 'Automatically detect and correct grammar, spelling, and punctuation errors.',              color: '#ec4899', path: '/dashboard/tools/grammar-checker' },
  { id: 'paraphrase',  icon: paraphraseIcon,  title: 'Paraphrasing Tool',      description: 'Rewrite sentences and paragraphs while preserving the original meaning.',                  color: '#8b5cf6', path: '/dashboard/tools/paraphrasing-tool' },
  { id: 'summary',     icon: summaryIcon,     title: 'Text Summarizer',        description: 'Create concise summaries from lengthy documents and articles.',                             color: '#d946ef', path: '/dashboard/tools/text-summarizer' },
  { id: 'tone',        icon: toneIcon,        title: 'Tone Analyzer',          description: 'Analyze and adjust the tone of your writing to match your audience.',                       color: '#c026d3', path: '/dashboard/tools/tone-analyzer' },
  { id: 'plagiarism',  icon: plagiarismIcon,  title: 'Plagiarism Detector',    description: 'Check your content for originality and potential plagiarism issues.',                       color: '#a855f7', path: '/dashboard/tools/plagiarism-detector' },
  { id: 'citation',    icon: citationIcon,    title: 'Citation Generator',     description: 'Generate accurate citations in APA, MLA, Chicago, and other formats.',                     color: '#9333ea', path: '/dashboard/tools/citation-generator' },
  { id: 'wordchoice',  icon: wordChoiceIcon,  title: 'Word Choice Enhancer',   description: 'Find better words and phrases to make your writing more impactful.',                       color: '#7c3aed', path: '/dashboard/tools/word-choice-enhancer' },
  { id: 'sentence',    icon: sentenceIcon,    title: 'Sentence Restructure',   description: 'Improve sentence structure and flow with AI-powered recommendations.',                     color: '#6d28d9', path: '/dashboard/tools/sentence-restructure' },
  { id: 'readability', icon: readabilityIcon, title: 'Readability Score',      description: 'Analyze and improve the readability of your content for any audience.',                    color: '#5b21b6', path: '/dashboard/tools/readability-score' },
  { id: 'vocabulary',  icon: vocabularyIcon,  title: 'Vocabulary Builder',     description: 'Expand your vocabulary with contextual word suggestions and synonyms.',                    color: '#7e22ce', path: '/dashboard/tools/vocabulary-builder' },
  { id: 'style',       icon: styleGuideIcon,  title: 'Style Guide',            description: 'Maintain consistency with customizable style guidelines and rules.',                        color: '#86198f', path: '/dashboard/tools/style-guide' },
];

// Subset shown on the dashboard quick-tools section
export const QUICK_TOOLS = ALL_TOOLS.slice(0, 4);

// Icons exported individually for use in activity lists, how-it-works, etc.
export { writingToolIcon, grammarIcon, paraphraseIcon, summaryIcon, toneIcon };
