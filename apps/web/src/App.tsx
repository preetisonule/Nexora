import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link } from 'react-router-dom';
import { Box, Button, Stack, Typography } from '@mui/material';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/common/ProtectedRoute';

// Layouts
import { LearnerLayout } from './components/learner/LearnerLayout';
import { AdminLayout } from './components/admin/AdminLayout';

// Public & Auth Pages
import { LandingPage } from './pages/LandingPage';
import { LoginPage } from './pages/auth/LoginPage';
import { RegisterPage } from './pages/auth/RegisterPage';
import { ForgotPasswordPage } from './pages/auth/ForgotPasswordPage';

// Learner Pages
import { DashboardPage } from './pages/learner/DashboardPage';
import { CourseCatalogPage } from './pages/learner/CourseCatalogPage';
import { CourseDetailPage } from './pages/learner/CourseDetailPage';
import { ModuleDetailPage } from './pages/learner/ModuleDetailPage';
import { LessonViewPage } from './pages/learner/LessonViewPage';
import { CodingAssignmentPage } from './pages/learner/CodingAssignmentPage';
import { AssessmentPage } from './pages/learner/AssessmentPage';
import { FinalProjectPage } from './pages/learner/FinalProjectPage';
import { CertificatesPage } from './pages/learner/CertificatesPage';
import { CertificateViewPage } from './pages/learner/CertificateViewPage';
import { PublicVerifyPage } from './pages/learner/PublicVerifyPage';
import { SettingsPage } from './pages/learner/SettingsPage';
import { LearningPathPage } from './pages/learner/LearningPathPage';

// Admin Pages
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminCoursesPage } from './pages/admin/AdminCoursesPage';
import { AdminModulesPage } from './pages/admin/AdminModulesPage';
import { AdminLessonsPage } from './pages/admin/AdminLessonsPage';
import { AdminAssignmentsPage } from './pages/admin/AdminAssignmentsPage';
import { AdminQuizzesPage } from './pages/admin/AdminQuizzesPage';
import { AdminUsersPage } from './pages/admin/AdminUsersPage';
import { AdminCertificatesPage } from './pages/admin/AdminCertificatesPage';
import { AdminAnalyticsPage } from './pages/admin/AdminAnalyticsPage';
import { AdminAuditLogsPage } from './pages/admin/AdminAuditLogsPage';

// 404 Page
const NotFoundPage: React.FC = () => {
  return (
    <Stack alignItems="center" justifyContent="center" textAlign="center" spacing={2} sx={{ minHeight: '70vh', p: 3 }}>
      <Typography sx={{ fontSize: 96, fontWeight: 800, lineHeight: 1, color: 'primary.main' }}>
        4<Box component="span" sx={{ color: 'secondary.main' }}>0</Box>4
      </Typography>
      <Typography variant="h5">Page Not Found</Typography>
      <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
        The page you are looking for doesn't exist or has been moved within Nexora.
      </Typography>
      <Stack direction="row" spacing={1.5} sx={{ pt: 1 }}>
        <Button component={Link} to="/dashboard" variant="contained">Go to Dashboard</Button>
        <Button component={Link} to="/" variant="outlined">Return Home</Button>
      </Stack>
    </Stack>
  );
};

export const App: React.FC = () => {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              {/* Learner Experience & Public Pages */}
              <Route element={<LearnerLayout />}>
                <Route path="/" element={<LandingPage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/courses" element={<CourseCatalogPage />} />
                <Route path="/courses/:slug" element={<CourseDetailPage />} />
                <Route path="/verify/:certificateId" element={<PublicVerifyPage />} />

                {/* Protected Learner Routes */}
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:courseSlug/learning-path"
                  element={
                    <ProtectedRoute>
                      <LearningPathPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn/:courseSlug/module/:moduleId"
                  element={
                    <ProtectedRoute>
                      <ModuleDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:courseSlug/modules/:moduleId"
                  element={
                    <ProtectedRoute>
                      <ModuleDetailPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn/:courseSlug/lesson/:lessonId"
                  element={
                    <ProtectedRoute>
                      <LessonViewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:courseSlug/modules/:moduleId/lessons/:lessonId"
                  element={
                    <ProtectedRoute>
                      <LessonViewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn/:courseSlug/assignment/:assignmentId"
                  element={
                    <ProtectedRoute>
                      <CodingAssignmentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:courseSlug/assignments/:assignmentId"
                  element={
                    <ProtectedRoute>
                      <CodingAssignmentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/learn/:courseSlug/assessment/:assessmentId"
                  element={
                    <ProtectedRoute>
                      <AssessmentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:courseSlug/assessments/:assessmentId"
                  element={
                    <ProtectedRoute>
                      <AssessmentPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/projects"
                  element={
                    <ProtectedRoute>
                      <FinalProjectPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/courses/:courseSlug/project"
                  element={
                    <ProtectedRoute>
                      <FinalProjectPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/certificates"
                  element={
                    <ProtectedRoute>
                      <CertificatesPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/certificates/:certificateId"
                  element={
                    <ProtectedRoute>
                      <CertificateViewPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/settings"
                  element={
                    <ProtectedRoute>
                      <SettingsPage />
                    </ProtectedRoute>
                  }
                />
              </Route>

              {/* Admin Panel Experience */}
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={['admin', 'superadmin']}>
                    <AdminLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboardPage />} />
                <Route path="courses" element={<AdminCoursesPage />} />
                <Route path="modules" element={<AdminModulesPage />} />
                <Route path="lessons" element={<AdminLessonsPage />} />
                <Route path="assignments" element={<AdminAssignmentsPage />} />
                <Route path="quizzes" element={<AdminQuizzesPage />} />
                <Route path="users" element={<AdminUsersPage />} />
                <Route path="certificates" element={<AdminCertificatesPage />} />
                <Route path="analytics" element={<AdminAnalyticsPage />} />
                <Route path="audit-logs" element={<AdminAuditLogsPage />} />
              </Route>

              {/* 404 Catch-All with LearnerLayout */}
              <Route element={<LearnerLayout />}>
                <Route path="*" element={<NotFoundPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
};

export default App;
