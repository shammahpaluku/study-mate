import React from "react";
import { ChakraProvider, Box, HStack } from "@chakra-ui/react";
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import customTheme from "./theme";
import SimplePage from "./pages/SimplePage";
import DashboardPage from "./pages/DashboardPage";
import StudyPlannerPage from "./pages/StudyPlannerPage";
import SettingsPage from "./pages/SettingsPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import Navigation from "./components/Navigation";
import AnimatedBackground from "./components/AnimatedBackground";
import { SettingsProvider } from "./contexts/SettingsContext";
import { useNotifications } from "./components/Notifications";

const AppContent: React.FC = () => {
  const { notifications } = useNotifications();

  return (
    <HStack h="100vh" align="stretch">
      <Navigation />
      <Box flex={1} bg="transparent" overflow="auto">
        <Routes>
          <Route path="/" element={<SimplePage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/planner" element={<StudyPlannerPage />} />
          <Route path="/analytics" element={<AnalyticsPage />} />
          <Route path="/settings" element={<SettingsPage />} />
        </Routes>
      </Box>
    </HStack>
  );
};

const App: React.FC = () => {
  return (
    <ChakraProvider theme={customTheme}>
      <SettingsProvider>
        <Router>
          <AnimatedBackground />
          <AppContent />
        </Router>
      </SettingsProvider>
    </ChakraProvider>
  );
};

export default App;
