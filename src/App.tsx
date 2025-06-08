
import React, { useState } from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthForm from './components/Auth/AuthForm';
import Navbar from './components/Layout/Navbar';
import Dashboard from './components/Dashboard/Dashboard';
import CoursesList from './components/Courses/CoursesList';
import CourseDetail from './components/Courses/CourseDetail';
import LessonViewer from './components/Lessons/LessonViewer';
import Quiz from './components/Quiz/Quiz';
import Payment from './components/Payment/Payment';
import Profile from './components/Profile/Profile';

const queryClient = new QueryClient();

interface AppState {
  currentPage: string;
  courseId?: number;
  lessonId?: number;
}

const AppContent: React.FC = () => {
  const { user } = useAuth();
  const [appState, setAppState] = useState<AppState>({
    currentPage: 'dashboard'
  });

  const handleNavigate = (page: string, courseId?: number, lessonId?: number) => {
    setAppState({ currentPage: page, courseId, lessonId });
  };

  const handleAuthSuccess = () => {
    setAppState({ currentPage: 'dashboard' });
  };

  if (!user) {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  const renderCurrentPage = () => {
    switch (appState.currentPage) {
      case 'dashboard':
        return <Dashboard onNavigate={handleNavigate} />;
      case 'courses':
        return <CoursesList onNavigate={handleNavigate} />;
      case 'course-detail':
        return appState.courseId ? (
          <CourseDetail courseId={appState.courseId} onNavigate={handleNavigate} />
        ) : <CoursesList onNavigate={handleNavigate} />;
      case 'lesson':
        return appState.courseId && appState.lessonId ? (
          <LessonViewer 
            courseId={appState.courseId} 
            lessonId={appState.lessonId} 
            onNavigate={handleNavigate} 
          />
        ) : <Dashboard onNavigate={handleNavigate} />;
      case 'quiz':
        return appState.courseId && appState.lessonId ? (
          <Quiz 
            courseId={appState.courseId} 
            lessonId={appState.lessonId} 
            onNavigate={handleNavigate} 
          />
        ) : <Dashboard onNavigate={handleNavigate} />;
      case 'payment':
        return appState.courseId ? (
          <Payment courseId={appState.courseId} onNavigate={handleNavigate} />
        ) : <CoursesList onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar currentPage={appState.currentPage} onNavigate={handleNavigate} />
      <main className="container mx-auto px-4 py-8">
        {renderCurrentPage()}
      </main>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
