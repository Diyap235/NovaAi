import { Link } from 'react-router-dom';
import logoImg from '../assets/generated/nova-ai-logo-elegant.dim_200x100.png';

/**
 * Navigation bar component for public pages with elegant Nova AI logo.
 */
function Navbar() {
  const scrollToFeatures = (e) => {
    e.preventDefault();
    const featuresSection = document.getElementById('features');
    if (featuresSection) {
      featuresSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="navbar-logo">
          <img src={logoImg} alt="Nova AI" className="logo-image" />
        </Link>
        <div className="navbar-links">
          <Link to="/" className="nav-link">Home</Link>
          <a href="#features" onClick={scrollToFeatures} className="nav-link">Features</a>
          <Link to="/login" className="nav-link">Login</Link>
          <Link to="/signup" className="nav-link nav-link-signup">Sign Up</Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
