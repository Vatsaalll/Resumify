import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Homepage from './pages/Homepage';
import ResumePage from './pages/ResumePage';
import ProjectsPage from './pages/ProjectsPage';
import PricingPage from './pages/PricingPage';
import QAPage from './pages/QAPage';
import AuthPage from './pages/AuthPage';
import AnimatedBackground from './components/AnimatedBackground';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <div className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-gray-900">
            <AnimatedBackground />
            <div className="relative z-10 flex flex-col min-h-screen">
              <Navbar />
              <main className="flex-grow">
                <Routes>
                  <Route path="/" element={<Homepage />} />
                  <Route path="/resume" element={<ResumePage />} />
                  <Route path="/projects" element={<ProjectsPage />} />
                  <Route path="/pricing" element={<PricingPage />} />
                  <Route path="/qa" element={<QAPage />} />
                  <Route path="/auth" element={<AuthPage />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </div>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;