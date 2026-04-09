import { Component } from 'react';

class ErrorBoundary extends Component {
  state = { hasError: false, message: '' };

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || 'Unknown error' };
  }

  render() {
    if (this.state.hasError)
      return (
        <div style={{ padding: '3rem', textAlign: 'center', color: '#ef4444' }}>
          <h2 style={{ marginBottom: '0.75rem' }}>Something went wrong.</h2>
          <p style={{ color: '#888', fontSize: '0.9rem', marginBottom: '1.5rem' }}>
            {this.state.message}
          </p>
          <button
            onClick={() => this.setState({ hasError: false, message: '' })}
            style={{ padding: '0.6rem 1.5rem', background: '#a855f7', color: '#fff', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            Try Again
          </button>
        </div>
      );
    return this.props.children;
  }
}

export default ErrorBoundary;
