import Sidebar from '../components/Sidebar';
import '../styles/dashboard.css';

/**
 * Tools page displaying all available Nova AI writing tools.
 */
function Tools() {
  const tools = [
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/writing-tool-icon.dim_64x64.png',
      title: 'AI Writing Assistant',
      description: 'Get intelligent suggestions to improve your writing style, clarity, and impact.',
      color: '#a855f7'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/grammar-icon.dim_64x64.png',
      title: 'Grammar Checker',
      description: 'Automatically detect and correct grammar, spelling, and punctuation errors.',
      color: '#ec4899'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/paraphrase-icon.dim_64x64.png',
      title: 'Paraphrasing Tool',
      description: 'Rewrite sentences and paragraphs while preserving the original meaning.',
      color: '#8b5cf6'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/summary-icon.dim_64x64.png',
      title: 'Text Summarizer',
      description: 'Create concise summaries from lengthy documents and articles.',
      color: '#d946ef'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/tone-icon.dim_64x64.png',
      title: 'Tone Analyzer',
      description: 'Analyze and adjust the tone of your writing to match your audience.',
      color: '#c026d3'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/plagiarism-icon.dim_64x64.png',
      title: 'Plagiarism Detector',
      description: 'Check your content for originality and potential plagiarism issues.',
      color: '#a855f7'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/citation-icon.dim_64x64.png',
      title: 'Citation Generator',
      description: 'Generate accurate citations in APA, MLA, Chicago, and other formats.',
      color: '#9333ea'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/word-choice-icon.dim_64x64.png',
      title: 'Word Choice Enhancer',
      description: 'Find better words and phrases to make your writing more impactful.',
      color: '#7c3aed'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/sentence-icon.dim_64x64.png',
      title: 'Sentence Restructure',
      description: 'Improve sentence structure and flow with AI-powered recommendations.',
      color: '#6d28d9'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/readability-icon.dim_64x64.png',
      title: 'Readability Score',
      description: 'Analyze and improve the readability of your content for any audience.',
      color: '#5b21b6'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/vocabulary-icon.dim_64x64.png',
      title: 'Vocabulary Builder',
      description: 'Expand your vocabulary with contextual word suggestions and synonyms.',
      color: '#7e22ce'
    },
    {
      icon: 'https://incredible-sapphire-zob-draft.caffeine.xyz/assets/generated/style-guide-icon.dim_64x64.png',
      title: 'Style Guide',
      description: 'Maintain consistency with customizable style guidelines and rules.',
      color: '#86198f'
    }
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar />
      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1 className="dashboard-title">AI Writing Tools</h1>
          <p className="dashboard-subtitle">Explore our comprehensive suite of AI-powered writing tools</p>
        </div>

        <div className="dashboard-content">
          <div className="tools-grid">
            {tools.map((tool, index) => (
              <div key={index} className="tool-card" style={{ '--card-color': tool.color }}>
                <div className="tool-icon">
                  <img src={tool.icon} alt={tool.title} />
                </div>
                <div className="tool-content">
                  <h3 className="tool-title">{tool.title}</h3>
                  <p className="tool-description">{tool.description}</p>
                  <button className="tool-button">Launch Tool</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Tools;
