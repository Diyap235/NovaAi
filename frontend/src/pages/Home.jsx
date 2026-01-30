import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import HowItWorksStep from '../components/HowItWorksStep';
import { useNavigate } from 'react-router-dom';
import { FiHeart, FiCheckCircle, FiZap, FiShield, FiUsers } from 'react-icons/fi';
import '../styles/home.css';

// Import images so Vite bundles them correctly
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
import aiBrainHero from '../assets/generated/ai-brain-hero.dim_800x400.png';

/**
 * Enhanced home page with hero, features, advantages, testimonials, and how it works sections.
 */
function Home() {
  const navigate = useNavigate();

  const features = [
    { icon: writingToolIcon, title: 'AI Writing Assistant', description: 'Enhance your writing with intelligent suggestions and improvements.', color: '#a855f7' },
    { icon: grammarIcon, title: 'Grammar Checker', description: 'Detect and fix grammar mistakes instantly with AI precision.', color: '#ec4899' },
    { icon: paraphraseIcon, title: 'Paraphrasing Tool', description: 'Rewrite content while maintaining original meaning and context.', color: '#8b5cf6' },
    { icon: summaryIcon, title: 'Text Summarizer', description: 'Generate concise summaries from long-form content instantly.', color: '#d946ef' },
    { icon: toneIcon, title: 'Tone Analyzer', description: 'Adjust your writing tone to match your audience perfectly.', color: '#c026d3' },
    { icon: plagiarismIcon, title: 'Plagiarism Detector', description: 'Ensure originality with advanced plagiarism detection.', color: '#a855f7' },
    { icon: citationIcon, title: 'Citation Generator', description: 'Create accurate citations in multiple formats effortlessly.', color: '#9333ea' },
    { icon: wordChoiceIcon, title: 'Word Choice Enhancer', description: 'Find better words and phrases to elevate your writing.', color: '#7c3aed' },
    { icon: sentenceIcon, title: 'Sentence Restructure', description: 'Improve sentence flow and clarity with AI recommendations.', color: '#6d28d9' },
    { icon: readabilityIcon, title: 'Readability Score', description: 'Analyze and improve content readability for your audience.', color: '#5b21b6' },
    { icon: vocabularyIcon, title: 'Vocabulary Builder', description: 'Expand your vocabulary with contextual word suggestions.', color: '#7e22ce' },
    { icon: styleGuideIcon, title: 'Style Guide', description: 'Maintain consistency with customizable style guidelines.', color: '#86198f' }
  ];

  const advantages = [
    {
      icon: FiZap,
      title: 'Lightning Fast Processing',
      description: 'Experience instant AI-powered suggestions and corrections with our optimized algorithms.'
    },
    {
      icon: FiShield,
      title: 'Privacy & Security First',
      description: 'Your content is encrypted and never stored. We prioritize your privacy.'
    },
    {
      icon: FiCheckCircle,
      title: 'Accuracy You Can Trust',
      description: 'Powered by advanced AI models ensuring the highest accuracy in grammar and style.'
    },
    {
      icon: FiUsers,
      title: 'Built for Everyone',
      description: 'From students to professionals, our intuitive interface adapts to your needs.'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Graduate Student',
      text: 'Nova AI has transformed my academic writing. The grammar checker saves me hours!',
      rating: 5,
      avatar: 'SJ'
    },
    {
      name: 'Michael Chen',
      role: 'Content Writer',
      text: 'The paraphrasing tool is incredible. It helps me create unique content perfectly.',
      rating: 5,
      avatar: 'MC'
    },
    {
      name: 'Emily Rodriguez',
      role: 'Marketing Manager',
      text: 'The tone analyzer ensures all our communications match our brand voice.',
      rating: 5,
      avatar: 'ER'
    }
  ];

  const howItWorksSteps = [
    { number: 1, title: 'Sign Up & Get Started', description: 'Create your free account in seconds and access all Nova AI tools.', icon: writingToolIcon },
    { number: 2, title: 'Choose Your Tool', description: 'Select from our comprehensive suite of AI-powered writing tools.', icon: grammarIcon },
    { number: 3, title: 'Input Your Content', description: 'Paste or type your text and let our AI analyze your writing.', icon: paraphraseIcon },
    { number: 4, title: 'Get Instant Results', description: 'Receive AI-powered suggestions and improvements in real-time.', icon: summaryIcon }
  ];

  return (
    <div className="home-page">
      <Navbar />
      
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Rewrite. Refine. Reinvent<br />
            <span className="hero-highlight">— with Nova AI</span>
          </h1>
          <p className="hero-subtitle">
            Transform your writing with cutting-edge AI technology. 
            Experience the future of content creation with intelligent suggestions.
          </p>
          <div className="hero-buttons">
            <button onClick={() => navigate('/signup')} className="btn btn-primary">
              Get Started Free
            </button>
            <button onClick={() => navigate('/login')} className="btn btn-secondary">
              Try Demo
            </button>
          </div>
        </div>
        <div className="hero-image">
          <img src={aiBrainHero} alt="AI Brain" />
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="features-container">
          <h2 className="features-heading">Powerful AI Features</h2>
          <p className="features-subheading">
            Discover the tools that will revolutionize your writing workflow
          </p>
          <div className="features-grid">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
                color={feature.color}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="advantages-section">
        <div className="advantages-container">
          <h2 className="section-heading">Why Choose Nova AI?</h2>
          <p className="section-subheading">
            Discover what makes Nova AI the preferred choice for writers worldwide
          </p>
          <div className="advantages-grid">
            {advantages.map((advantage, index) => {
              const Icon = advantage.icon;
              return (
                <div key={index} className="advantage-card">
                  <div className="advantage-icon">
                    <Icon />
                  </div>
                  <h3 className="advantage-title">{advantage.title}</h3>
                  <p className="advantage-description">{advantage.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <h2 className="section-heading">How It Works</h2>
          <p className="section-subheading">
            Get started with Nova AI in four simple steps
          </p>
          <div className="how-it-works-grid">
            {howItWorksSteps.map((step, index) => (
              <HowItWorksStep
                key={index}
                number={step.number}
                title={step.title}
                description={step.description}
                icon={step.icon}
              />
            ))}
          </div>
        </div>
      </section>

      <footer className="footer">
        <p className="footer-text">
          © 2026 Nova AI. Designed and developed by Mann Shah and Diya Prajapati.
         
        </p>
      </footer>
    </div>
  );
}

export default Home;
