import React from 'react';
import { ChakraProvider, Box, theme } from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import UnitsPage from './pages/UnitsPage';
import SchedulePage from './pages/SchedulePage';
import SettingsPage from './pages/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import ResetPasswordPage from './pages/ResetPasswordPage';
import VerifyEmailPage from './pages/VerifyEmailPage';

const AuthLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }} display="flex" alignItems="center" justifyContent="center" p={4}>
    <Box w="100%" maxW="md">
      {children}
    </Box>
  </Box>
);

const App: React.FC = () => {
  return (
    <ChakraProvider theme={theme}>
      <ThemeProvider>
        <AuthProvider>
          <Router>
            <Box minH="100vh" bg="gray.50" _dark={{ bg: 'gray.900' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={
                  <AuthLayout>
                    <LoginPage />
                  </AuthLayout>
                } />

                <Route path="/register" element={
                  <AuthLayout>
                    <RegisterPage />
                  </AuthLayout>
                } />

                <Route path="/forgot-password" element={
                  <AuthLayout>
                    <ForgotPasswordPage />
                  </AuthLayout>
                } />

                <Route path="/reset-password" element={
                  <AuthLayout>
                    <ResetPasswordPage />
                  </AuthLayout>
                } />

                <Route path="/verify-email" element={
                  <AuthLayout>
                    <VerifyEmailPage />
                  </AuthLayout>
                } />

                {/* Protected Routes */}
                <Route path="/" element={<HomePage />} />
                <Route
                  path="/dashboard"
                  element={
                    <ProtectedRoute>
                      <DashboardPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/units"
                  element={
                    <ProtectedRoute>
                      <UnitsPage />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/schedule"
                  element={
                    <ProtectedRoute>
                      <SchedulePage />
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
              </Routes>
                      <ProtectedRoute>
                        <SchedulePage />
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
                </Routes>
              </Layout>
            </Box>
          </Router>
        </AuthProvider>
      </ThemeProvider>
    </ChakraProvider>
  );
};

export default App;
