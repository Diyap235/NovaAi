import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiZap, FiShield, FiCheckCircle, FiUsers } from 'react-icons/fi';
import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import TestimonialCard from '../components/TestimonialCard';
import HowItWorksStep from '../components/HowItWorksStep';
import { ALL_TOOLS, writingToolIcon, grammarIcon, paraphraseIcon, summaryIcon } from '../constants/tools';
import aiBrainHero from '../assets/generated/ai-brain-hero.dim_800x400.png';
import '../styles/home.css';

// Static data outside component — no recreation on re-render
const ADVANTAGES = [
  { icon: FiZap,          title: 'Lightning Fast Processing', description: 'Experience instant AI-powered suggestions and corrections with our optimized algorithms.' },
  { icon: FiShield,       title: 'Privacy & Security First',  description: 'Your content is encrypted and never stored. We prioritize your privacy.' },
  { icon: FiCheckCircle,  title: 'Accuracy You Can Trust',    description: 'Powered by advanced AI models ensuring the highest accuracy in grammar and style.' },
  { icon: FiUsers,        title: 'Built for Everyone',        description: 'From students to professionals, our intuitive interface adapts to your needs.' },
];

const TESTIMONIALS = [
  { name: 'Sarah Johnson',    role: 'Graduate Student',    text: 'Nova AI has transformed my academic writing. The grammar checker saves me hours!',              rating: 5, avatar: 'SJ' },
  { name: 'Michael Chen',     role: 'Content Writer',      text: 'The paraphrasing tool is incredible. It helps me create unique content perfectly.',             rating: 5, avatar: 'MC' },
  { name: 'Emily Rodriguez',  role: 'Marketing Manager',   text: 'The tone analyzer ensures all our communications match our brand voice.',                       rating: 5, avatar: 'ER' },
];

const HOW_IT_WORKS = [
  { number: 1, title: 'Sign Up & Get Started',  description: 'Create your free account in seconds and access all Nova AI tools.',                icon: writingToolIcon },
  { number: 2, title: 'Choose Your Tool',        description: 'Select from our comprehensive suite of AI-powered writing tools.',                  icon: grammarIcon },
  { number: 3, title: 'Input Your Content',      description: 'Paste or type your text and let our AI analyze your writing.',                      icon: paraphraseIcon },
  { number: 4, title: 'Get Instant Results',     description: 'Receive AI-powered suggestions and improvements in real-time.',                     icon: summaryIcon },
];

function Home() {
  const navigate = useNavigate();

  const goToSignup = useCallback(() => navigate('/signup'), [navigate]);
  const goToLogin  = useCallback(() => navigate('/login'),  [navigate]);

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
            <button onClick={goToSignup} className="btn btn-primary">Get Started Free</button>
            <button onClick={goToLogin}  className="btn btn-secondary">Try Demo</button>
          </div>
        </div>
        <div className="hero-image">
          <img src={aiBrainHero} alt="AI Brain visualization" />
        </div>
      </section>

      <section id="features" className="features-section">
        <div className="features-container">
          <h2 className="features-heading">Powerful AI Features</h2>
          <p className="features-subheading">Discover the tools that will revolutionize your writing workflow</p>
          <div className="features-grid">
            {ALL_TOOLS.map((feature) => (
              <FeatureCard key={feature.id} icon={feature.icon} title={feature.title} description={feature.description} color={feature.color} />
            ))}
          </div>
        </div>
      </section>

      <section className="advantages-section">
        <div className="advantages-container">
          <h2 className="section-heading">Why Choose Nova AI?</h2>
          <p className="section-subheading">Discover what makes Nova AI the preferred choice for writers worldwide</p>
          <div className="advantages-grid">
            {ADVANTAGES.map((adv) => {
              const Icon = adv.icon;
              return (
                <div key={adv.title} className="advantage-card">
                  <div className="advantage-icon"><Icon /></div>
                  <h3 className="advantage-title">{adv.title}</h3>
                  <p className="advantage-description">{adv.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="how-it-works-section">
        <div className="how-it-works-container">
          <h2 className="section-heading">How It Works</h2>
          <p className="section-subheading">Get started with Nova AI in four simple steps</p>
          <div className="how-it-works-grid">
            {HOW_IT_WORKS.map((step) => (
              <HowItWorksStep key={step.number} number={step.number} title={step.title} description={step.description} icon={step.icon} />
            ))}
          </div>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-container">
          <h2 className="section-heading">What Our Users Say</h2>
          <p className="section-subheading">Join thousands of writers who trust Nova AI</p>
          <div className="testimonials-grid">
            {TESTIMONIALS.map((t) => (
              <TestimonialCard key={t.name} name={t.name} role={t.role} text={t.text} rating={t.rating} avatar={t.avatar} />
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
