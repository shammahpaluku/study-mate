import React from 'react';
import { Box, Text, VStack, HStack, Progress, Icon } from '@chakra-ui/react';
import { FiTarget, FiClock, FiTrendingUp, FiBook } from 'react-icons/fi';

interface StudyStatsProps {
  studyTime: number;
  completedUnits: number;
  totalUnits: number;
  currentStreak: number;
}

const StudyStats: React.FC<StudyStatsProps> = ({ 
  studyTime, 
  completedUnits, 
  totalUnits, 
  currentStreak 
}) => {
  const progressPercentage = totalUnits > 0 ? (completedUnits / totalUnits) * 100 : 0;

  return (
    <VStack spacing={4} align="stretch">
      <Text fontSize="lg" fontWeight="600" color="gray.800">
        Your Progress
      </Text>
      
      <HStack spacing={6} justify="space-between">
        <VStack spacing={2} align="center" flex={1}>
          <Icon as={FiClock} boxSize={6} color="blue.500" />
          <Text fontSize="2xl" fontWeight="bold" color="gray.900">
            {Math.floor(studyTime / 60)}h {studyTime % 60}m
          </Text>
          <Text fontSize="sm" color="gray.600">Study Time</Text>
        </VStack>

        <VStack spacing={2} align="center" flex={1}>
          <Icon as={FiBook} boxSize={6} color="green.500" />
          <Text fontSize="2xl" fontWeight="bold" color="gray.900">
            {completedUnits}/{totalUnits}
          </Text>
          <Text fontSize="sm" color="gray.600">Units</Text>
        </VStack>

        <VStack spacing={2} align="center" flex={1}>
          <Icon as={FiTrendingUp} boxSize={6} color="orange.500" />
          <Text fontSize="2xl" fontWeight="bold" color="gray.900">
            {currentStreak}
          </Text>
          <Text fontSize="sm" color="gray.600">Day Streak</Text>
        </VStack>
      </HStack>

      <Box>
        <HStack justify="space-between" mb={2}>
          <Text fontSize="sm" color="gray.600">Overall Progress</Text>
          <Text fontSize="sm" fontWeight="600" color="gray.800">
            {Math.round(progressPercentage)}%
          </Text>
        </HStack>
        <Progress 
          value={progressPercentage} 
          colorScheme="blue" 
          height="8px" 
          borderRadius="4px"
        />
      </Box>
    </VStack>
  );
};

export default StudyStats;
