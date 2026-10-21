import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { LandingPage } from '../pages/LandingPage';
import { DashboardPage } from '../pages/DashboardPage';
import { NotFoundPage } from '../pages/NotFoundPage';

// 5 Independent Feature Module Pages
import { ResumeBuilderPage } from '../modules/resume-builder/ResumeBuilderPage';
import { ResumeTailorPage } from '../modules/resume-tailoring/ResumeTailorPage';
import { JobSuggestionsPage } from '../modules/job-suggestions/JobSuggestionsPage';
import { MockInterviewPage } from '../modules/mock-interview/MockInterviewPage';
import { TechNewsPage } from '../modules/tech-news/TechNewsPage';

export const AppRouter: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      
      {/* 5 Completely Independent Module Routes */}
      <Route path="/builder" element={<ResumeBuilderPage />} />
      <Route path="/tailor" element={<ResumeTailorPage />} />
      <Route path="/jobs" element={<JobSuggestionsPage />} />
      <Route path="/interview" element={<MockInterviewPage />} />
      <Route path="/news" element={<TechNewsPage />} />

      {/* Authenticated Dashboard Hub */}
      <Route path="/dashboard" element={<DashboardPage />} />

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
