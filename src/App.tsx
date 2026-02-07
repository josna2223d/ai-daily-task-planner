import { useState, useEffect } from 'react';
import { TaskProvider } from './store/TaskContext';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const auth = localStorage.getItem('daypilot_auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <TaskProvider>
      {isAuthenticated ? <Dashboard /> : <Auth onLogin={handleLogin} />}
    </TaskProvider>
  );
}
