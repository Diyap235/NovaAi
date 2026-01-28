/**
 * Reusable feature card component with icon, title, and description.
 */
function FeatureCard({ icon, title, description, color }) {
  return (
    <div className="feature-card" style={{ '--card-color': color }}>
      <div className="feature-icon">
        <img src={icon} alt={title} />
      </div>
      <h3 className="feature-title">{title}</h3>
      <p className="feature-description">{description}</p>
    </div>
  );
}

export default FeatureCard;
