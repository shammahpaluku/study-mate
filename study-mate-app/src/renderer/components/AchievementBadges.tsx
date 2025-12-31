import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Badge,
  Icon,
  useColorModeValue,
} from "@chakra-ui/react";
import {
  FiAward,
  FiStar,
  FiTrendingUp,
  FiTarget,
  FiClock,
} from "react-icons/fi";

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  category: "time" | "streak" | "goals" | "sessions";
}

const AchievementBadges: React.FC = () => {
  const [achievements, setAchievements] = useState<Achievement[]>([
    {
      id: "1",
      title: "First Steps",
      description: "Complete your first study session",
      icon: "FiStar",
      unlocked: false,
      category: "sessions",
    },
    {
      id: "2",
      title: "Time Master",
      description: "Study for 100 hours total",
      icon: "FiClock",
      unlocked: false,
      category: "time",
    },
    {
      id: "3",
      title: "Week Warrior",
      description: "Maintain a 7-day streak",
      icon: "FiTrendingUp",
      unlocked: false,
      category: "streak",
    },
    {
      id: "4",
      title: "Goal Getter",
      description: "Complete your first goal",
      icon: "FiTarget",
      unlocked: false,
      category: "goals",
    },
    {
      id: "5",
      title: "Dedicated Student",
      description: "Study for 30 days in a month",
      icon: "FiAward",
      unlocked: false,
      category: "sessions",
    },
  ]);

  useEffect(() => {
    const savedAchievements = localStorage.getItem("studyAchievements");
    if (savedAchievements) {
      setAchievements(JSON.parse(savedAchievements));
    }
    checkAchievements();
  }, []);

  const checkAchievements = () => {
    const studyActivities = localStorage.getItem("studyActivities");
    const studyGoals = localStorage.getItem("studyGoals");

    if (!studyActivities) return;

    const activities = JSON.parse(studyActivities);
    const goals = studyGoals ? JSON.parse(studyGoals) : [];

    const updatedAchievements = achievements.map((achievement) => {
      if (achievement.unlocked) return achievement;

      let shouldUnlock = false;

      switch (achievement.id) {
        case "1": // First session
          shouldUnlock = activities.length > 0;
          break;
        case "2": // 100 hours
          {
            const totalMinutes = activities.reduce(
              (acc: number, act: any) => acc + act.duration,
              0,
            );
            shouldUnlock = totalMinutes >= 6000; // 100 hours in minutes
          }
          break;
        case "3": // 7-day streak
          {
            const streak = calculateStreak(activities);
            shouldUnlock = streak >= 7;
          }
          break;
        case "4": // First goal completed
          shouldUnlock = goals.some((goal: any) => goal.completed);
          break;
        case "5": // 30 days in month
          {
            const uniqueDays = new Set(
              activities.map((act: any) =>
                new Date(act.timestamp).toDateString(),
              ),
            ).size;
            shouldUnlock = uniqueDays >= 30;
          }
          break;
      }

      if (shouldUnlock) {
        return {
          ...achievement,
          unlocked: true,
          unlockedAt: new Date().toISOString(),
        };
      }

      return achievement;
    });

    setAchievements(updatedAchievements);
    localStorage.setItem(
      "studyAchievements",
      JSON.stringify(updatedAchievements),
    );
  };

  const calculateStreak = (activities: any[]): number => {
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

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case "FiStar":
        return FiStar;
      case "FiClock":
        return FiClock;
      case "FiTrendingUp":
        return FiTrendingUp;
      case "FiTarget":
        return FiTarget;
      case "FiAward":
        return FiAward;
      default:
        return FiAward;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "time":
        return "blue";
      case "streak":
        return "green";
      case "goals":
        return "purple";
      case "sessions":
        return "orange";
      default:
        return "gray";
    }
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

  const unlockedCount = achievements.filter((a) => a.unlocked).length;
  const totalCount = achievements.length;

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
        <HStack justify="space-between" align="center">
          <HStack spacing={3}>
            <Icon as={FiAward} boxSize={5} color="orange.500" />
            <Heading as="h3" size="md" color="gray.900">
              Achievements
            </Heading>
          </HStack>
          <Badge colorScheme="orange" variant="subtle">
            {unlockedCount}/{totalCount}
          </Badge>
        </HStack>

        <VStack spacing={4} align="stretch">
          {achievements.map((achievement) => {
            const IconComponent = getIcon(achievement.icon);
            const categoryColor = getCategoryColor(achievement.category);

            return (
              <Box
                key={achievement.id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                borderColor={
                  achievement.unlocked ? `${categoryColor}.200` : borderColor
                }
                bg={achievement.unlocked ? `${categoryColor}.50` : cardBg}
                opacity={achievement.unlocked ? 1 : 0.6}
                transition="all 0.3s"
              >
                <HStack spacing={3} align="start">
                  <Icon
                    as={IconComponent}
                    boxSize={6}
                    color={
                      achievement.unlocked ? `${categoryColor}.500` : "gray.400"
                    }
                  />
                  <VStack align="start" spacing={1} flex={1}>
                    <HStack spacing={2}>
                      <Text
                        fontWeight="600"
                        color={achievement.unlocked ? "gray.900" : "gray.600"}
                      >
                        {achievement.title}
                      </Text>
                      {achievement.unlocked && (
                        <Badge colorScheme={categoryColor} size="sm">
                          ✓
                        </Badge>
                      )}
                    </HStack>
                    <Text fontSize="sm" color="gray.600">
                      {achievement.description}
                    </Text>
                    {achievement.unlocked && achievement.unlockedAt && (
                      <Text fontSize="xs" color={`${categoryColor}.600`}>
                        Unlocked:{" "}
                        {new Date(achievement.unlockedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </VStack>
                </HStack>
              </Box>
            );
          })}
        </VStack>

        {unlockedCount === 0 && (
          <Text color="gray.500" textAlign="center" py={4}>
            Start studying to unlock your first achievement!
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default AchievementBadges;
