import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Progress,
  Badge,
  useColorModeValue,
  Icon,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { FiTrendingUp, FiAward, FiCalendar, FiTarget } from "react-icons/fi";

interface StreakData {
  currentStreak: number;
  longestStreak: number;
  totalStudyDays: number;
  streakHistory: { date: string; hasActivity: boolean }[];
  monthlyStreaks: { month: string; streak: number }[];
}

const StudyStreak: React.FC = () => {
  const [streakData, setStreakData] = useState<StreakData>({
    currentStreak: 0,
    longestStreak: 0,
    totalStudyDays: 0,
    streakHistory: [],
    monthlyStreaks: [],
  });

  useEffect(() => {
    loadStreakData();
  }, []);

  const loadStreakData = () => {
    const studyActivities = localStorage.getItem("studyActivities");
    if (!studyActivities) return;

    const activities = JSON.parse(studyActivities);

    // Calculate streak data
    const currentStreak = calculateCurrentStreak(activities);
    const longestStreak = calculateLongestStreak(activities);
    const totalStudyDays = calculateTotalStudyDays(activities);
    const streakHistory = generateStreakHistory(activities);
    const monthlyStreaks = calculateMonthlyStreaks(activities);

    setStreakData({
      currentStreak,
      longestStreak,
      totalStudyDays,
      streakHistory,
      monthlyStreaks,
    });
  };

  const calculateCurrentStreak = (activities: any[]): number => {
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

  const calculateLongestStreak = (activities: any[]): number => {
    if (activities.length === 0) return 0;

    const activityDates = activities
      .map((act) => {
        const date = new Date(act.timestamp);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      })
      .sort((a, b) => a - b);

    let longestStreak = 0;
    let currentStreak = 0;
    let lastDate = 0;

    for (const activityDate of activityDates) {
      if (lastDate === 0 || activityDate - lastDate === 86400000) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else if (activityDate - lastDate > 86400000) {
        currentStreak = 1;
      }
      lastDate = activityDate;
    }

    return longestStreak;
  };

  const calculateTotalStudyDays = (activities: any[]): number => {
    const uniqueDays = new Set(
      activities.map((act: any) => {
        const date = new Date(act.timestamp);
        date.setHours(0, 0, 0, 0);
        return date.getTime();
      }),
    );
    return uniqueDays.size;
  };

  const generateStreakHistory = (
    activities: any[],
  ): { date: string; hasActivity: boolean }[] => {
    const history: { date: string; hasActivity: boolean }[] = [];
    const today = new Date();

    // Generate last 30 days
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);

      const hasActivity = activities.some((act: any) => {
        const activityDate = new Date(act.timestamp);
        activityDate.setHours(0, 0, 0, 0);
        return activityDate.getTime() === date.getTime();
      });

      history.push({
        date: date.toISOString().split("T")[0],
        hasActivity,
      });
    }

    return history;
  };

  const calculateMonthlyStreaks = (
    activities: any[],
  ): { month: string; streak: number }[] => {
    const monthlyMap: { [key: string]: number } = {};

    activities.forEach((activity: any) => {
      const date = new Date(activity.timestamp);
      const monthKey = date.toLocaleDateString("en-US", {
        month: "short",
        year: "numeric",
      });

      if (!monthlyMap[monthKey]) {
        monthlyMap[monthKey] = 0;
      }

      // Count unique study days in this month
      const monthActivities = activities.filter((act: any) => {
        const actDate = new Date(act.timestamp);
        return (
          actDate.toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          }) === monthKey
        );
      });

      const uniqueDays = new Set(
        monthActivities.map((act: any) => {
          const actDate = new Date(act.timestamp);
          actDate.setHours(0, 0, 0, 0);
          return actDate.getTime();
        }),
      );

      monthlyMap[monthKey] = uniqueDays.size;
    });

    return Object.entries(monthlyMap)
      .map(([month, streak]) => ({ month, streak }))
      .slice(-6); // Last 6 months
  };

  const getStreakColor = (streak: number) => {
    if (streak >= 30) return "purple";
    if (streak >= 14) return "blue";
    if (streak >= 7) return "green";
    if (streak >= 3) return "yellow";
    return "gray";
  };

  const getStreakMessage = (streak: number) => {
    if (streak >= 100) return "Legendary! 🔥";
    if (streak >= 30) return "Amazing! 🌟";
    if (streak >= 14) return "Great job! 💪";
    if (streak >= 7) return "Keep it up! 🎯";
    if (streak >= 3) return "Good start! 👍";
    return "Start your streak! 📚";
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="lg"
      borderColor={borderColor}
      bg={cardBg}
      boxShadow="sm"
    >
      <VStack spacing={6} align="stretch">
        <HStack spacing={3}>
          <Icon as={FiTrendingUp} boxSize={5} color="orange.500" />
          <Heading as="h3" size="md" color="gray.900">
            Study Streaks
          </Heading>
        </HStack>

        {/* Current Streak Display */}
        <Box
          p={4}
          borderRadius="lg"
          bg={`${getStreakColor(streakData.currentStreak)}.50`}
          borderWidth={1}
          borderColor={`${getStreakColor(streakData.currentStreak)}.200`}
        >
          <VStack spacing={3} align="center">
            <HStack spacing={2}>
              <Icon
                as={FiAward}
                boxSize={6}
                color={`${getStreakColor(streakData.currentStreak)}.500`}
              />
              <Text
                fontSize="3xl"
                fontWeight="bold"
                color={`${getStreakColor(streakData.currentStreak)}.700`}
              >
                {streakData.currentStreak}
              </Text>
            </HStack>
            <Text
              fontSize="lg"
              fontWeight="600"
              color={`${getStreakColor(streakData.currentStreak)}.600`}
            >
              Day Streak
            </Text>
            <Text
              fontSize="sm"
              color={`${getStreakColor(streakData.currentStreak)}.600`}
            >
              {getStreakMessage(streakData.currentStreak)}
            </Text>
          </VStack>
        </Box>

        {/* Streak Stats */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(2, 1fr)" }} gap={4}>
          <Box
            p={4}
            borderRadius="lg"
            bg="blue.50"
            borderWidth={1}
            borderColor="blue.200"
          >
            <VStack spacing={2} align="start">
              <HStack spacing={2}>
                <Icon as={FiTarget} boxSize={4} color="blue.500" />
                <Text fontSize="sm" color="blue.600" fontWeight="600">
                  Longest Streak
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.700">
                {streakData.longestStreak} days
              </Text>
            </VStack>
          </Box>

          <Box
            p={4}
            borderRadius="lg"
            bg="green.50"
            borderWidth={1}
            borderColor="green.200"
          >
            <VStack spacing={2} align="start">
              <HStack spacing={2}>
                <Icon as={FiCalendar} boxSize={4} color="green.500" />
                <Text fontSize="sm" color="green.600" fontWeight="600">
                  Total Study Days
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="green.700">
                {streakData.totalStudyDays}
              </Text>
            </VStack>
          </Box>
        </Grid>

        {/* Recent Streak History */}
        <Box>
          <Text fontSize="md" fontWeight="600" color="gray.800" mb={3}>
            Recent Activity (Last 30 Days)
          </Text>
          <HStack spacing={1} wrap="wrap">
            {streakData.streakHistory.map((day, index) => (
              <Box
                key={day.date}
                w={8}
                h={8}
                borderRadius="md"
                bg={day.hasActivity ? "green.500" : "gray.200"}
                title={day.date}
                transition="all 0.2s ease-in-out"
                _hover={{
                  transform: "scale(1.1)",
                  boxShadow: "sm",
                }}
              />
            ))}
          </HStack>
        </Box>

        {/* Monthly Streaks */}
        {streakData.monthlyStreaks.length > 0 && (
          <Box>
            <Text fontSize="md" fontWeight="600" color="gray.800" mb={3}>
              Monthly Study Days
            </Text>
            <VStack spacing={2}>
              {streakData.monthlyStreaks.map((month, index) => (
                <HStack key={month.month} spacing={3} align="center">
                  <Text fontSize="sm" color="gray.600" w="80px">
                    {month.month}
                  </Text>
                  <Box flex={1}>
                    <Progress
                      value={month.streak}
                      max={31}
                      colorScheme="orange"
                      size="sm"
                      borderRadius="full"
                    />
                  </Box>
                  <Badge colorScheme="orange" variant="subtle" size="sm">
                    {month.streak} days
                  </Badge>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default StudyStreak;
