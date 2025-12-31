import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Icon,
  Button,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  CloseButton,
  SlideFade,
  ScaleFade,
  Fade,
} from "@chakra-ui/react";
import {
  FiBell,
  FiX,
  FiCheck,
  FiClock,
  FiAlertTriangle,
  FiInfo,
} from "react-icons/fi";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

interface NotificationsProps {
  notifications: Notification[];
  onNotificationRead: (id: string) => void;
  onNotificationDismiss: (id: string) => void;
  onClearAll: () => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  onNotificationRead,
  onNotificationDismiss,
  onClearAll,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const toast = useToast();

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationIcon = (type: string) => {
    const icons = {
      info: FiInfo,
      success: FiCheck,
      warning: FiAlertTriangle,
      error: FiAlertTriangle,
    };
    return icons[type as keyof typeof icons] || FiInfo;
  };

  const getNotificationColor = (type: string) => {
    const colors = {
      info: "blue",
      success: "green",
      warning: "yellow",
      error: "red",
    };
    return colors[type as keyof typeof colors] || "blue";
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60),
    );

    if (diffInMinutes < 1) return "Just now";
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return `${Math.floor(diffInMinutes / 1440)}d ago`;
  };

  const handleNotificationClick = (notification: Notification) => {
    if (!notification.read) {
      onNotificationRead(notification.id);
    }
    if (notification.action) {
      notification.action.onClick();
    }
  };

  return (
    <Box position="relative">
      {/* Notification Bell */}
      <Button
        variant="ghost"
        position="relative"
        onClick={() => setShowNotifications(!showNotifications)}
        p={2}
      >
        <Icon as={FiBell} boxSize={5} color="gray.600" />
        {unreadCount > 0 && (
          <Badge
            position="absolute"
            top={0}
            right={0}
            colorScheme="red"
            borderRadius="full"
            fontSize="xs"
            minW={5}
            h={5}
            display="flex"
            alignItems="center"
            justifyContent="center"
          >
            {unreadCount > 9 ? "9+" : unreadCount}
          </Badge>
        )}
      </Button>

      {/* Notifications Dropdown */}
      <SlideFade in={showNotifications} offsetY={-10}>
        <Box
          position="absolute"
          top="100%"
          right={0}
          mt={2}
          w={380}
          maxH={500}
          bg="white"
          borderWidth={1}
          borderColor="gray.200"
          borderRadius="lg"
          boxShadow="lg"
          zIndex={1000}
          overflow="hidden"
        >
          {/* Header */}
          <HStack
            p={4}
            borderBottomWidth={1}
            borderColor="gray.200"
            justify="space-between"
            align="center"
          >
            <HStack spacing={2}>
              <Icon as={FiBell} boxSize={4} color="gray.600" />
              <Text fontWeight="600" color="gray.800">
                Notifications
              </Text>
              {unreadCount > 0 && (
                <Badge colorScheme="blue" size="sm">
                  {unreadCount} new
                </Badge>
              )}
            </HStack>
            {notifications.length > 0 && (
              <Button
                size="xs"
                variant="ghost"
                onClick={onClearAll}
                color="gray.600"
              >
                Clear all
              </Button>
            )}
          </HStack>

          {/* Notifications List */}
          <Box maxH={400} overflowY="auto">
            {notifications.length === 0 ? (
              <Box p={8} textAlign="center">
                <Icon as={FiBell} boxSize={8} color="gray.400" mb={3} />
                <Text color="gray.600" fontSize="sm">
                  No notifications yet
                </Text>
                <Text color="gray.500" fontSize="xs" mt={1}>
                  We&apos;ll notify you about important updates
                </Text>
              </Box>
            ) : (
              <VStack spacing={0} align="stretch">
                {notifications.map((notification) => (
                  <Box
                    key={notification.id}
                    p={4}
                    borderBottomWidth={1}
                    borderColor="gray.100"
                    cursor="pointer"
                    bg={!notification.read ? "blue.50" : "transparent"}
                    onClick={() => handleNotificationClick(notification)}
                    _hover={{ bg: "gray.50" }}
                    transition="background-color 0.2s"
                  >
                    <HStack spacing={3} align="flex-start">
                      <Icon
                        as={getNotificationIcon(notification.type)}
                        boxSize={4}
                        color={`${getNotificationColor(notification.type)}.500`}
                        mt={1}
                        flexShrink={0}
                      />
                      <VStack spacing={1} align="stretch" flex={1}>
                        <HStack justify="space-between" align="flex-start">
                          <Text
                            fontWeight={!notification.read ? "600" : "500"}
                            color="gray.900"
                            fontSize="sm"
                            flex={1}
                          >
                            {notification.title}
                          </Text>
                          <CloseButton
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              onNotificationDismiss(notification.id);
                            }}
                          />
                        </HStack>
                        <Text color="gray.600" fontSize="xs">
                          {notification.message}
                        </Text>
                        <HStack justify="space-between" align="center">
                          <Text color="gray.500" fontSize="xs">
                            {formatTimestamp(notification.timestamp)}
                          </Text>
                          {notification.action && (
                            <Button
                              size="xs"
                              variant="outline"
                              colorScheme={getNotificationColor(
                                notification.type,
                              )}
                              onClick={(e) => {
                                e.stopPropagation();
                                notification.action!.onClick();
                              }}
                            >
                              {notification.action.label}
                            </Button>
                          )}
                        </HStack>
                      </VStack>
                    </HStack>
                  </Box>
                ))}
              </VStack>
            )}
          </Box>
        </Box>
      </SlideFade>
    </Box>
  );
};

// Notification Manager Hook
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  const addNotification = (
    notification: Omit<Notification, "id" | "timestamp" | "read">,
  ) => {
    const newNotification: Notification = {
      ...notification,
      id: Date.now().toString(),
      timestamp: new Date(),
      read: false,
    };
    setNotifications((prev) => [newNotification, ...prev]);
  };

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
    );
  };

  const dismissNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    markAsRead,
    dismissNotification,
    clearAll,
  };
};

export default Notifications;
