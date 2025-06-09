import React from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { StudentProvider } from './context/StudentContext';
import { ClassProvider } from './context/ClassContext';
import Dashboard from './pages/Dashboard';
import AuthPage from './components/AuthPage';
import Loader from './components/Loader';

// Main App content that requires authentication
const AppContent = () => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <Loader text="Loading NavGurukul..." />;
  }

  if (!isAuthenticated) {
    return <AuthPage />;
  }

  return (
    <StudentProvider>
      <ClassProvider>
        <div className="App">
          <Dashboard />
        </div>
      </ClassProvider>
    </StudentProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App; 