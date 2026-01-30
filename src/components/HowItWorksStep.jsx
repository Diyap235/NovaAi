/**
 * Interactive step component for "How It Works" section.
 */
function HowItWorksStep({ number, title, description, icon }) {
  return (
    <div className="how-it-works-step">
      <div className="step-number">{number}</div>
      <div className="step-icon">
        <img src={icon} alt={title} />
      </div>
      <h3 className="step-title">{title}</h3>
      <p className="step-description">{description}</p>
    </div>
  );
}

export default HowItWorksStep;
