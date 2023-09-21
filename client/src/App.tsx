import { AnimatePresence } from 'framer-motion';
import Cookies from 'js-cookie';
import React from 'react';
import {
  Navigate, Route, Routes, useLocation,
} from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import SharedStory from './pages/SharedStory';
import './App.scss';

function App() {
  const location = useLocation();
  const token = Cookies.get('jwtToken') || null;

  return (
    <AnimatePresence initial={false}>
      <Routes location={location} key={location.pathname}>
        <Route path="sign-in" element={<Login />} />
        <Route
          path="dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>}
        />
        <Route path="/" element={
          token
            ? <Navigate to="/dashboard" />
            : <Navigate to="/sign-in" />} />
        <Route path="/story/:link" element={<SharedStory />} />
        <Route path="*" element={
          token
            ? <Navigate to="/dashboard" />
            : <Navigate to="/sign-in" />} />
        <Route path="/api/auth" element={<div />} />
      </Routes>
    </AnimatePresence>
  );
}

export default App;
