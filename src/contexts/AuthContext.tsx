
import React, { createContext, useContext, useState, useEffect } from 'react';

interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  enrolledCourses: number[];
  completedLessons: { [courseId: number]: number[] };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  enrollCourse: (courseId: number) => void;
  completeLesson: (courseId: number, lessonId: number) => void;
  isEnrolled: (courseId: number) => boolean;
  isLessonCompleted: (courseId: number, lessonId: number) => boolean;
  getProgress: (courseId: number) => number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = users.find((u: any) => u.email === email && u.password === password);
    
    if (foundUser) {
      const { password: _, ...userWithoutPassword } = foundUser;
      setUser(userWithoutPassword);
      localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
      return true;
    }
    return false;
  };

  const register = async (name: string, email: string, password: string): Promise<boolean> => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (users.some((u: any) => u.email === email)) {
      return false; // Email already exists
    }

    const newUser: User & { password: string } = {
      id: Date.now().toString(),
      name,
      email,
      password,
      enrolledCourses: [],
      completedLessons: {}
    };

    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    return true;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData };
      setUser(updatedUser);
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      
      // Update in users array
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const userIndex = users.findIndex((u: any) => u.id === user.id);
      if (userIndex !== -1) {
        users[userIndex] = { ...users[userIndex], ...userData };
        localStorage.setItem('users', JSON.stringify(users));
      }
    }
  };

  const enrollCourse = (courseId: number) => {
    if (user && !user.enrolledCourses.includes(courseId)) {
      const updatedUser = {
        ...user,
        enrolledCourses: [...user.enrolledCourses, courseId]
      };
      updateUser(updatedUser);
    }
  };

  const completeLesson = (courseId: number, lessonId: number) => {
    if (user) {
      const completedLessons = { ...user.completedLessons };
      if (!completedLessons[courseId]) {
        completedLessons[courseId] = [];
      }
      if (!completedLessons[courseId].includes(lessonId)) {
        completedLessons[courseId].push(lessonId);
        updateUser({ completedLessons });
      }
    }
  };

  const isEnrolled = (courseId: number): boolean => {
    return user?.enrolledCourses?.includes(courseId) || false;
  };

  const isLessonCompleted = (courseId: number, lessonId: number): boolean => {
    return user?.completedLessons?.[courseId]?.includes(lessonId) || false;
  };

  const getProgress = (courseId: number): number => {
    const course = require('../data/courses.js').coursesData.find((c: any) => c.id === courseId);
    if (!course || !user?.completedLessons?.[courseId]) return 0;
    
    const totalLessons = course.lessons.length;
    const completedCount = user.completedLessons[courseId].length;
    return Math.round((completedCount / totalLessons) * 100);
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      updateUser,
      enrollCourse,
      completeLesson,
      isEnrolled,
      isLessonCompleted,
      getProgress
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
