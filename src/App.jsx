import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import SprintGame from './pages/SprintGame';
import Leaderboard from './pages/Leaderboard';
import AiMentor from './pages/AiMentor';

export default function App() {
  return (
    <Routes>
      <Route path="/auth" element={<Auth />} />

      <Route element={<MainLayout />}>
        <Route path="/" element={<Navigate to="/dashboard" replace />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/sprint" element={<SprintGame />} />
        <Route path="/mentor" element={<AiMentor />} />
        <Route path="/subjects" element={<Dashboard />} />
        <Route path="/leaderboard" element={<Leaderboard />} />
      </Route>

      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
}
