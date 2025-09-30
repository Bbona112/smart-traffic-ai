import React, { useState, useEffect } from 'react';
import { LoginForm } from './components/login-form';
import { Dashboard } from './components/dashboard';

interface User {
  id: string;
  email: string;
  name: string;
}

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem('traffic_ai_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setIsLoading(false);
  }, []);

  const handleLogin = async (email: string, password: string) => {
    // Mock authentication - in real app this would be API call
    if (email && password) {
      const mockUser = {
        id: '1',
        email,
        name: email.split('@')[0]
      };
      setUser(mockUser);
      localStorage.setItem('traffic_ai_user', JSON.stringify(mockUser));
      return { success: true };
    }
    return { success: false, error: 'Invalid credentials' };
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('traffic_ai_user');
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {!user ? (
        <LoginForm onLogin={handleLogin} />
      ) : (
        <Dashboard user={user} onLogout={handleLogout} />
      )}
    </div>
  );
}

export default App;