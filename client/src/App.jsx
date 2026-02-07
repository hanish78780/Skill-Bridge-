import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ChatProvider } from './context/ChatContext';
import { ToastProvider } from './context/ToastContext';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetails from './pages/ProjectDetails';
import ProjectForm from './pages/ProjectForm';
import Profile from './pages/Profile';
import AuthSuccess from './pages/AuthSuccess';
import TalentSearch from './pages/TalentSearch';
import Chat from './pages/Chat';

import { ThemeProvider } from './context/ThemeContext';
import AnimatedRoutes from './components/AnimatedRoutes';

function App() {
  return (
    <Router>
      <ToastProvider>
        <AuthProvider>
          <ThemeProvider>
            <ChatProvider>
              <AnimatedRoutes />
            </ChatProvider>
          </ThemeProvider>
        </AuthProvider>
      </ToastProvider>
    </Router>
  );
}

export default App;
