import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Tools from './pages/Tools';
import History from './pages/History';
import Profile from './pages/Profile';

/**
 * Main App component with React Router configuration.
 * Handles public routes (Home, Login, Signup) and protected dashboard routes.
 */

// Protected Route Component
function ProtectedRoute({ children }) {
  const currentUser = localStorage.getItem('currentUser');
  return currentUser ? children : <Navigate to="/login" replace />;
}

function App() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        
        {/* Protected Dashboard Routes */}
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
        <Route path="/dashboard/tools" element={<ProtectedRoute><Tools /></ProtectedRoute>} />
        <Route path="/dashboard/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
        <Route path="/dashboard/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
      </Routes>
    </Router>
  );
}

export default App;
