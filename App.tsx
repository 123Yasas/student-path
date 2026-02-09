import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Discovery from './pages/Discovery';
import Roadmap from './pages/Roadmap';
import Goals from './pages/Goals';
import Resources from './pages/Resources';
import Profile from './pages/Profile';
import Assistant from './pages/Assistant';
import Achievements from './pages/Achievements';
import PortfolioBuilder from './pages/PortfolioBuilder';
import Auth from './pages/Auth';
import { useStore } from './context/StoreContext';

const App: React.FC = () => {
  const { user } = useStore();

  if (!user) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={ <Dashboard /> } />
        <Route path="discovery" element={<Discovery />} />
        <Route path="roadmap" element={<Roadmap />} />
        <Route path="achievements" element={<Achievements />} />
        <Route path="portfolio" element={<PortfolioBuilder />} />
        <Route path="goals" element={<Goals />} />
        <Route path="resources" element={<Resources />} />
        <Route path="profile" element={<Profile />} />
        <Route path="assistant" element={<Assistant />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
};

export default App;