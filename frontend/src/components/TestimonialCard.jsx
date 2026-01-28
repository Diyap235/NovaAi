import { FiStar } from 'react-icons/fi';

/**
 * Testimonial card component displaying user feedback.
 */
function TestimonialCard({ name, role, text, rating, avatar }) {
  return (
    <div className="testimonial-card">
      <div className="testimonial-header">
        <div className="testimonial-avatar">
          {avatar}
        </div>
        <div className="testimonial-info">
          <h4 className="testimonial-name">{name}</h4>
          <p className="testimonial-role">{role}</p>
        </div>
      </div>
      <div className="testimonial-rating">
        {[...Array(rating)].map((_, i) => (
          <FiStar key={i} className="star-icon filled" />
        ))}
      </div>
      <p className="testimonial-text">{text}</p>
    </div>
  );
}

export default TestimonialCard;
