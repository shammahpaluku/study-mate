import React from 'react';
import { Box, Text, VStack, HStack, Icon, Badge, Divider } from '@chakra-ui/react';
import { FiBook, FiClock, FiTarget } from 'react-icons/fi';

interface StudyActivity {
  id: string;
  subject: string;
  duration: number;
  timestamp: Date;
  notes?: string;
}

interface RecentActivityProps {
  activities: StudyActivity[];
}

const RecentActivity: React.FC<RecentActivityProps> = ({ activities }) => {
  const formatDuration = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m`;
  };

  const formatTimestamp = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) {
      const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
      return `${diffInMinutes} minutes ago`;
    } else if (diffInHours < 24) {
      return `${diffInHours} hours ago`;
    } else {
      const diffInDays = Math.floor(diffInHours / 24);
      return `${diffInDays} days ago`;
    }
  };

  const getSubjectColor = (subject: string) => {
    const colors = ['blue', 'green', 'purple', 'orange', 'pink', 'teal'];
    const hash = subject.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };

  if (activities.length === 0) {
    return (
      <Box 
        p={6} 
        borderWidth={1} 
        borderRadius="lg" 
        borderColor="gray.200"
        bg="white"
        boxShadow="sm"
        textAlign="center"
      >
        <VStack spacing={3}>
          <Icon as={FiBook} boxSize={12} color="gray.400" />
          <Text color="gray.600" fontSize="lg">
            No study sessions yet
          </Text>
          <Text color="gray.500" fontSize="sm">
            Start your first study session to see your activity here
          </Text>
        </VStack>
      </Box>
    );
  }

  return (
    <Box 
      p={6} 
      borderWidth={1} 
      borderRadius="lg" 
      borderColor="gray.200"
      bg="white"
      boxShadow="sm"
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="xl" fontWeight="600" color="gray.800">
          Recent Activity
        </Text>

        <VStack spacing={3} align="stretch">
          {activities.slice(0, 5).map((activity, index) => (
            <Box key={activity.id}>
              <HStack spacing={3} align="flex-start">
                <Icon as={FiClock} color="gray.400" mt={1} flexShrink={0} />
                <VStack spacing={1} align="stretch" flex={1}>
                  <HStack spacing={2} justify="space-between">
                    <Text fontWeight="600" color="gray.800">
                      {activity.subject}
                    </Text>
                    <Badge colorScheme={getSubjectColor(activity.subject)} size="sm">
                      {formatDuration(activity.duration)}
                    </Badge>
                  </HStack>
                  
                  {activity.notes && (
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {activity.notes}
                    </Text>
                  )}
                  
                  <Text fontSize="xs" color="gray.500">
                    {formatTimestamp(activity.timestamp)}
                  </Text>
                </VStack>
              </HStack>
              {index < Math.min(activities.length - 1, 4) && (
                <Divider mt={3} />
              )}
            </Box>
          ))}
        </VStack>

        {activities.length > 5 && (
          <Text fontSize="sm" color="gray.500" textAlign="center" pt={2}>
            Showing 5 of {activities.length} sessions
          </Text>
        )}
      </VStack>
    </Box>
  );
};

export default RecentActivity;
