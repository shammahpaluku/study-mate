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
import { FiTrendingUp, FiClock, FiTarget, FiCalendar } from "react-icons/fi";

interface AnalyticsData {
  totalStudyTime: number;
  averageSessionTime: number;
  totalSessions: number;
  weeklyProgress: number[];
  subjectBreakdown: { subject: string; time: number; percentage: number }[];
  monthlyTrend: { month: string; hours: number }[];
}

const StudyAnalytics: React.FC = () => {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    totalStudyTime: 0,
    averageSessionTime: 0,
    totalSessions: 0,
    weeklyProgress: [0, 0, 0, 0, 0, 0, 0],
    subjectBreakdown: [],
    monthlyTrend: [],
  });

  useEffect(() => {
    loadAnalyticsData();
  }, []);

  const loadAnalyticsData = () => {
    const studyActivities = localStorage.getItem("studyActivities");
    if (!studyActivities) return;

    const activities = JSON.parse(studyActivities);

    // Calculate analytics
    const totalStudyTime = activities.reduce(
      (acc: number, act: any) => acc + act.duration,
      0,
    );
    const totalSessions = activities.length;
    const averageSessionTime =
      totalSessions > 0 ? totalStudyTime / totalSessions : 0;

    // Calculate weekly progress (last 7 days)
    const weeklyProgress = calculateWeeklyProgress(activities);

    // Calculate subject breakdown
    const subjectBreakdown = calculateSubjectBreakdown(activities);

    // Calculate monthly trend
    const monthlyTrend = calculateMonthlyTrend(activities);

    setAnalyticsData({
      totalStudyTime,
      averageSessionTime,
      totalSessions,
      weeklyProgress,
      subjectBreakdown,
      monthlyTrend,
    });
  };

  const calculateWeeklyProgress = (activities: any[]): number[] => {
    const weeklyData = [0, 0, 0, 0, 0, 0, 0];
    const today = new Date();

    activities.forEach((activity: any) => {
      const activityDate = new Date(activity.timestamp);
      const daysDiff = Math.floor(
        (today.getTime() - activityDate.getTime()) / (1000 * 60 * 60 * 24),
      );

      if (daysDiff < 7) {
        const dayIndex = 6 - daysDiff; // 0 = oldest, 6 = today
        weeklyData[dayIndex] += activity.duration;
      }
    });

    return weeklyData;
  };

  const calculateSubjectBreakdown = (activities: any[]) => {
    const subjectMap: { [key: string]: number } = {};

    activities.forEach((activity: any) => {
      if (!subjectMap[activity.subject]) {
        subjectMap[activity.subject] = 0;
      }
      subjectMap[activity.subject] += activity.duration;
    });

    const total = Object.values(subjectMap).reduce(
      (acc: number, val: number) => acc + val,
      0,
    );

    return Object.entries(subjectMap)
      .map(([subject, time]) => ({
        subject,
        time,
        percentage: total > 0 ? (time / total) * 100 : 0,
      }))
      .sort((a, b) => b.time - a.time);
  };

  const calculateMonthlyTrend = (activities: any[]) => {
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
      monthlyMap[monthKey] += activity.duration;
    });

    return Object.entries(monthlyMap)
      .map(([month, minutes]) => ({
        month,
        hours: Math.round((minutes / 60) * 10) / 10,
      }))
      .slice(-6); // Last 6 months
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
          <Icon as={FiTrendingUp} boxSize={5} color="blue.500" />
          <Heading as="h3" size="md" color="gray.900">
            Study Analytics
          </Heading>
        </HStack>

        {/* Key Metrics */}
        <Grid templateColumns={{ base: "1fr", md: "repeat(3, 1fr)" }} gap={4}>
          <Box
            p={4}
            borderRadius="lg"
            bg="blue.50"
            borderWidth={1}
            borderColor="blue.200"
          >
            <VStack spacing={2} align="start">
              <HStack spacing={2}>
                <Icon as={FiClock} boxSize={4} color="blue.500" />
                <Text fontSize="sm" color="blue.600" fontWeight="600">
                  Total Study Time
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="blue.700">
                {Math.floor(analyticsData.totalStudyTime / 60)}h{" "}
                {analyticsData.totalStudyTime % 60}m
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
                <Icon as={FiTarget} boxSize={4} color="green.500" />
                <Text fontSize="sm" color="green.600" fontWeight="600">
                  Total Sessions
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="green.700">
                {analyticsData.totalSessions}
              </Text>
            </VStack>
          </Box>

          <Box
            p={4}
            borderRadius="lg"
            bg="purple.50"
            borderWidth={1}
            borderColor="purple.200"
          >
            <VStack spacing={2} align="start">
              <HStack spacing={2}>
                <Icon as={FiCalendar} boxSize={4} color="purple.500" />
                <Text fontSize="sm" color="purple.600" fontWeight="600">
                  Avg Session
                </Text>
              </HStack>
              <Text fontSize="2xl" fontWeight="bold" color="purple.700">
                {Math.floor(analyticsData.averageSessionTime)}m
              </Text>
            </VStack>
          </Box>
        </Grid>

        {/* Weekly Progress */}
        <Box>
          <Text fontSize="md" fontWeight="600" color="gray.800" mb={3}>
            Weekly Progress (Last 7 Days)
          </Text>
          <VStack spacing={2}>
            {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
              (day, index) => (
                <HStack key={day} spacing={3} align="center">
                  <Text fontSize="sm" color="gray.600" w="50px">
                    {day}
                  </Text>
                  <Box flex={1}>
                    <Progress
                      value={analyticsData.weeklyProgress[index]}
                      max={120} // 2 hours max
                      colorScheme="blue"
                      size="sm"
                      borderRadius="full"
                    />
                  </Box>
                  <Text
                    fontSize="sm"
                    color="gray.700"
                    w="60px"
                    textAlign="right"
                  >
                    {Math.floor(analyticsData.weeklyProgress[index] / 60)}h{" "}
                    {analyticsData.weeklyProgress[index] % 60}m
                  </Text>
                </HStack>
              ),
            )}
          </VStack>
        </Box>

        {/* Subject Breakdown */}
        {analyticsData.subjectBreakdown.length > 0 && (
          <Box>
            <Text fontSize="md" fontWeight="600" color="gray.800" mb={3}>
              Subject Breakdown
            </Text>
            <VStack spacing={2}>
              {analyticsData.subjectBreakdown.map((subject, index) => (
                <HStack key={subject.subject} spacing={3} align="center">
                  <Text fontSize="sm" color="gray.600" w="120px" noOfLines={1}>
                    {subject.subject}
                  </Text>
                  <Box flex={1}>
                    <Progress
                      value={subject.percentage}
                      colorScheme="green"
                      size="sm"
                      borderRadius="full"
                    />
                  </Box>
                  <Badge colorScheme="green" variant="subtle" size="sm">
                    {subject.percentage.toFixed(1)}%
                  </Badge>
                </HStack>
              ))}
            </VStack>
          </Box>
        )}

        {/* Monthly Trend */}
        {analyticsData.monthlyTrend.length > 0 && (
          <Box>
            <Text fontSize="md" fontWeight="600" color="gray.800" mb={3}>
              Monthly Trend
            </Text>
            <HStack spacing={4} align="flex-end">
              {analyticsData.monthlyTrend.map((month, index) => {
                const maxHours = Math.max(
                  ...analyticsData.monthlyTrend.map((m) => m.hours),
                );
                const height =
                  maxHours > 0 ? (month.hours / maxHours) * 100 : 0;

                return (
                  <VStack key={month.month} spacing={2} align="center" flex={1}>
                    <Box
                      h={`${height}px`}
                      w="full"
                      bg="blue.500"
                      borderRadius="sm"
                      minH="4px"
                    />
                    <Text fontSize="xs" color="gray.600" textAlign="center">
                      {month.month}
                    </Text>
                    <Text fontSize="xs" color="gray.700" fontWeight="600">
                      {month.hours}h
                    </Text>
                  </VStack>
                );
              })}
            </HStack>
          </Box>
        )}
      </VStack>
    </Box>
  );
};

export default StudyAnalytics;
