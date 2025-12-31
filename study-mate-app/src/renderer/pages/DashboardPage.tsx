import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Container,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import StudyStats from "../components/StudyStats";
import StudySession from "../components/StudySession";
import RecentActivity from "../components/RecentActivity";
import MotivationalQuotes from "../components/MotivationalQuotes";
import ProgressBar from "../components/ProgressBar";
import GoalTracker from "../components/GoalTracker";
import AchievementBadges from "../components/AchievementBadges";
import { useNotifications } from "../components/Notifications";

interface StudyActivity {
  id: string;
  subject: string;
  duration: number;
  timestamp: Date;
  notes?: string;
}

const DashboardPage: React.FC = () => {
  const [activities, setActivities] = useState<StudyActivity[]>([]);
  const [stats, setStats] = useState({
    studyTime: 0,
    completedUnits: 0,
    totalUnits: 10,
    currentStreak: 0,
  });
  const { addNotification } = useNotifications();

  useEffect(() => {
    // Load saved activities from localStorage
    const savedActivities = localStorage.getItem("studyActivities");
    if (savedActivities) {
      const parsed = JSON.parse(savedActivities);
      setActivities(
        parsed.map((act: any) => ({
          ...act,
          timestamp: new Date(act.timestamp),
        })),
      );

      // Calculate stats
      const totalStudyTime = parsed.reduce(
        (acc: number, act: StudyActivity) => acc + act.duration,
        0,
      );
      const uniqueSubjects = new Set(
        parsed.map((act: StudyActivity) => act.subject),
      ).size;

      setStats((prev) => ({
        ...prev,
        studyTime: totalStudyTime,
        completedUnits: uniqueSubjects,
        currentStreak: calculateStreak(parsed),
      }));
    }

    // Welcome notification
    addNotification({
      title: "Welcome back!",
      message: "Ready to continue your learning journey?",
      type: "info",
    });
  }, []);

  const calculateStreak = (activities: StudyActivity[]): number => {
    if (activities.length === 0) return 0;

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const activityDates = activities
      .map((act) => {
        const date = new Date(act.timestamp);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
      .sort((a, b) => b - a);

    let streak = 0;
    let currentDate = today.getTime();

    for (const activityDate of activityDates) {
      if (
        activityDate === currentDate ||
        activityDate === currentDate - 86400000
      ) {
        streak++;
        currentDate = activityDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const handleStartSession = (sessionData: {
    subject: string;
    notes: string;
    duration: number;
  }) => {
    const newActivity: StudyActivity = {
      id: Date.now().toString(),
      subject: sessionData.subject,
      duration: sessionData.duration,
      timestamp: new Date(),
      notes: sessionData.notes,
    };

    const updatedActivities = [newActivity, ...activities];
    setActivities(updatedActivities);

    // Save to localStorage
    localStorage.setItem("studyActivities", JSON.stringify(updatedActivities));

    // Update stats
    const totalStudyTime = updatedActivities.reduce(
      (acc, act) => acc + act.duration,
      0,
    );
    const uniqueSubjects = new Set(updatedActivities.map((act) => act.subject))
      .size;

    setStats((prev) => ({
      ...prev,
      studyTime: totalStudyTime,
      completedUnits: uniqueSubjects,
      currentStreak: calculateStreak(updatedActivities),
    }));

    // Achievement notification
    if (sessionData.duration >= 3600) {
      addNotification({
        title: "Great session!",
        message: `You studied ${sessionData.subject} for ${Math.floor(sessionData.duration / 60)} minutes!`,
        type: "success",
      });
    }

    // Streak notification
    const newStreak = calculateStreak(updatedActivities);
    if (newStreak > stats.currentStreak && newStreak >= 3) {
      addNotification({
        title: "Streak milestone!",
        message: `${newStreak} day streak - keep it up!`,
        type: "success",
      });
    }
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" color="gray.900" mb={2}>
            Study Dashboard
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Track your learning progress and stay motivated
          </Text>
        </Box>

        <Grid templateColumns={{ base: "1fr", lg: "2fr 1fr" }} gap={6}>
          <GridItem>
            <VStack spacing={6}>
              <MotivationalQuotes />
              <StudySession onStartSession={handleStartSession} />
              <GoalTracker />
              <RecentActivity activities={activities} />
            </VStack>
          </GridItem>

          <GridItem>
            <VStack spacing={6}>
              <StudyStats
                studyTime={stats.studyTime}
                completedUnits={stats.completedUnits}
                totalUnits={stats.totalUnits}
                currentStreak={stats.currentStreak}
              />
              <AchievementBadges />
              <Box
                p={6}
                borderWidth={1}
                borderRadius="lg"
                borderColor="gray.200"
                bg="white"
                boxShadow="sm"
              >
                <VStack spacing={4} align="stretch">
                  <Text fontSize="lg" fontWeight="600" color="gray.800">
                    Today&apos;s Progress
                  </Text>
                  <ProgressBar
                    value={stats.studyTime}
                    max={480}
                    label="Study Time (minutes)"
                    colorScheme="blue"
                    showPercentage
                  />
                  <ProgressBar
                    value={stats.completedUnits}
                    max={stats.totalUnits}
                    label="Units Completed"
                    colorScheme="green"
                  />
                  <ProgressBar
                    value={stats.currentStreak}
                    max={30}
                    label="Current Streak (days)"
                    colorScheme="yellow"
                  />
                </VStack>
              </Box>
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
};

export default DashboardPage;
