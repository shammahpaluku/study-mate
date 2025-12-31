import React from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Icon,
  Divider,
  useColorModeValue,
  Badge,
} from "@chakra-ui/react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiBarChart2,
  FiCalendar,
  FiSettings,
  FiBook,
  FiTarget,
  FiClock,
  FiTrendingUp,
  FiAward,
} from "react-icons/fi";
import Notifications, { useNotifications } from "./Notifications";

interface NavigationProps {
  stats?: {
    studyTime: number;
    completedUnits: number;
    currentStreak: number;
  };
}

const Navigation: React.FC<NavigationProps> = ({ stats }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const {
    notifications,
    addNotification,
    markAsRead,
    dismissNotification,
    clearAll,
  } = useNotifications();

  const menuItems = [
    { path: "/", label: "Home", icon: FiHome },
    { path: "/dashboard", label: "Dashboard", icon: FiBarChart2 },
    { path: "/planner", label: "Study Planner", icon: FiCalendar },
    { path: "/analytics", label: "Analytics", icon: FiTrendingUp },
    { path: "/settings", label: "Settings", icon: FiSettings },
  ];

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const bg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");
  const textColor = useColorModeValue("gray.700", "gray.300");
  const hoverBg = useColorModeValue("gray.50", "gray.700");

  return (
    <Box
      w="280px"
      h="100vh"
      bg={bg}
      borderWidth={1}
      borderColor={borderColor}
      borderRightWidth={1}
      p={6}
      boxShadow="sm"
    >
      <VStack spacing={8} align="stretch" h="full">
        {/* Enhanced Header */}
        <Box>
          <HStack spacing={4} align="center" pb={4}>
            <Box
              p={3}
              borderRadius="xl"
              bg="linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
              boxShadow="md"
            >
              <Icon as={FiBook} boxSize={6} color="white" />
            </Box>
            <VStack spacing={0} align="start">
              <Text
                fontSize="xl"
                fontWeight="bold"
                color="gray.900"
                letterSpacing="-0.025em"
              >
                Study Mate
              </Text>
              <Text
                fontSize="xs"
                color="gray.500"
                textTransform="uppercase"
                letterSpacing="0.05em"
              >
                Learning Companion
              </Text>
            </VStack>
          </HStack>
          <Divider borderColor={borderColor} />
        </Box>

        {/* Enhanced Navigation Menu */}
        <VStack spacing={2} align="stretch" flex={1}>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Button
                key={item.path}
                variant={isActive ? "solid" : "ghost"}
                colorScheme={isActive ? "primary" : "gray"}
                justifyContent="flex-start"
                leftIcon={<Icon as={item.icon} boxSize={5} />}
                onClick={() => handleNavigation(item.path)}
                borderRadius="lg"
                fontWeight={isActive ? "600" : "500"}
                py={3}
                px={4}
                transition="all 0.2s ease-in-out"
                _hover={{
                  transform: "translateX(2px)",
                  bg: isActive ? undefined : hoverBg,
                }}
              >
                {item.label}
              </Button>
            );
          })}
        </VStack>

        <Divider borderColor={borderColor} />

        {/* Enhanced Quick Stats */}
        {stats && (
          <Box
            p={4}
            borderRadius="lg"
            bg={bg}
            borderWidth={1}
            borderColor={borderColor}
          >
            <Text fontSize="sm" fontWeight="600" color="gray.700" mb={4}>
              Today&apos;s Progress
            </Text>

            <VStack spacing={3} align="stretch">
              <HStack spacing={3} justify="space-between">
                <HStack spacing={2}>
                  <Icon as={FiClock} boxSize={4} color="blue.500" />
                  <Text fontSize="sm" color={textColor}>
                    Study Time
                  </Text>
                </HStack>
                <Badge colorScheme="blue" variant="subtle" size="sm">
                  {Math.floor(stats.studyTime / 60)}h {stats.studyTime % 60}m
                </Badge>
              </HStack>

              <HStack spacing={3} justify="space-between">
                <HStack spacing={2}>
                  <Icon as={FiTarget} boxSize={4} color="green.500" />
                  <Text fontSize="sm" color={textColor}>
                    Units
                  </Text>
                </HStack>
                <Badge colorScheme="green" variant="subtle" size="sm">
                  {stats.completedUnits}
                </Badge>
              </HStack>

              <HStack spacing={3} justify="space-between">
                <HStack spacing={2}>
                  <Icon as={FiAward} boxSize={4} color="orange.500" />
                  <Text fontSize="sm" color={textColor}>
                    Streak
                  </Text>
                </HStack>
                <Badge colorScheme="orange" variant="subtle" size="sm">
                  {stats.currentStreak} days
                </Badge>
              </HStack>
            </VStack>
          </Box>
        )}

        {/* Notifications */}
        <Box>
          <Notifications
            notifications={notifications}
            onNotificationRead={markAsRead}
            onNotificationDismiss={dismissNotification}
            onClearAll={clearAll}
          />
        </Box>
      </VStack>
    </Box>
  );
};

export default Navigation;
