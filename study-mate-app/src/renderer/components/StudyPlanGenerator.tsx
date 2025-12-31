import React, { useState } from 'react';
import { 
  Box, VStack, HStack, Text, Button, Progress, Badge, 
  Icon, useToast, Divider, Alert, AlertIcon, AlertTitle
} from '@chakra-ui/react';
import { FiCalendar, FiClock, FiTarget, FiZap, FiAlertTriangle } from 'react-icons/fi';

export interface StudyBlock {
  id: string;
  unitName: string;
  startTime: string;
  endTime: string;
  duration: number;
  type: 'deep-focus' | 'sprint' | 'revision' | 'break';
  day: string;
  difficulty: 'easy' | 'moderate' | 'hard';
}

export interface GeneratedPlan {
  id: string;
  blocks: StudyBlock[];
  totalHours: number;
  averageDailyHours: number;
  stressIndex: number;
  warnings: string[];
}

interface Unit {
  id: string;
  name: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  type: 'exam' | 'practical' | 'project';
  assessmentDate?: string;
  weightScore: number;
}

interface Availability {
  dailyHours: number;
  weeklyDays: string[];
  preferredTimes: string[];
  studyPreference: 'long' | 'short' | 'mixed';
}

interface StudyPlanGeneratorProps {
  units: Unit[];
  availability: Availability;
  onPlanGenerated: (plan: GeneratedPlan) => void;
}

const StudyPlanGenerator: React.FC<StudyPlanGeneratorProps> = ({ 
  units, 
  availability, 
  onPlanGenerated 
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [progress, setProgress] = useState(0);
  const toast = useToast();

  const generateStudyPlan = async () => {
    if (units.length === 0) {
      toast({
        title: "No units configured",
        description: "Please add at least one study unit before generating a plan",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    if (availability.weeklyDays.length === 0) {
      toast({
        title: "No study days selected",
        description: "Please select at least one study day",
        status: "warning",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    setIsGenerating(true);
    setProgress(0);

    // Simulate generation process
    await new Promise(resolve => setTimeout(resolve, 1000));
    setProgress(25);

    await new Promise(resolve => setTimeout(resolve, 1000));
    setProgress(50);

    await new Promise(resolve => setTimeout(resolve, 1000));
    setProgress(75);

    const plan = await generatePlanLogic();
    setProgress(100);

    await new Promise(resolve => setTimeout(resolve, 500));
    setIsGenerating(false);
    setProgress(0);

    onPlanGenerated(plan);

    toast({
      title: "Study plan generated!",
      description: `Created ${plan.blocks.length} study blocks across ${availability.weeklyDays.length} days`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const generatePlanLogic = (): GeneratedPlan => {
    const blocks: StudyBlock[] = [];
    const totalAvailableHours = availability.dailyHours * availability.weeklyDays.length;
    const totalWeightScore = units.reduce((sum, unit) => sum + unit.weightScore, 0);
    
    const warnings: string[] = [];
    let stressIndex = 0;

    // Calculate time allocation per unit
    const unitAllocations = units.map(unit => ({
      ...unit,
      allocatedHours: (unit.weightScore / totalWeightScore) * totalAvailableHours
    }));

    // Check for potential issues
    if (totalAvailableHours < 10) {
      warnings.push("Low total study hours - consider increasing daily availability");
    }

    if (units.filter(u => u.difficulty === 'hard').length > 3) {
      warnings.push("Many difficult units - ensure adequate preparation time");
    }

    const upcomingExams = units.filter(u => 
      u.type === 'exam' && u.assessmentDate && 
      new Date(u.assessmentDate).getTime() - Date.now() < 14 * 24 * 60 * 60 * 1000
    );

    if (upcomingExams.length > 0) {
      warnings.push(`${upcomingExams.length} exams in next 2 weeks - increased focus recommended`);
    }

    // Generate study blocks
    availability.weeklyDays.forEach((day, dayIndex) => {
      let dayHoursUsed = 0;
      const dayUnits = [...unitAllocations].sort((a, b) => b.weightScore - a.weightScore);
      
      dayUnits.forEach(unit => {
        const remainingHours = unit.allocatedHours - (dayHoursUsed * (1 / availability.weeklyDays.length));
        
        if (remainingHours > 0 && dayHoursUsed < availability.dailyHours) {
          const blockDuration = availability.studyPreference === 'long' ? 90 : 
                              availability.studyPreference === 'short' ? 30 : 60;
          
          const blockHours = Math.min(blockDuration / 60, remainingHours, availability.dailyHours - dayHoursUsed);
          
          if (blockHours > 0.25) { // Minimum 15 minutes
            const startTime = calculateStartTime(dayHoursUsed, availability.preferredTimes);
            const endTime = calculateEndTime(startTime, blockHours);
            
            blocks.push({
              id: `${unit.id}-${day}-${dayIndex}`,
              unitName: unit.name,
              startTime,
              endTime,
              duration: blockHours * 60,
              type: unit.type === 'exam' ? 'deep-focus' : 
                    unit.type === 'practical' ? 'sprint' : 'revision',
              day,
              difficulty: unit.difficulty
            });
            
            dayHoursUsed += blockHours;
          }
        }
      });

      // Add breaks if long study sessions
      if (availability.studyPreference !== 'short' && dayHoursUsed > 2) {
        const breakTime = Math.floor(dayHoursUsed / 2);
        blocks.push({
          id: `break-${day}-${dayIndex}`,
          unitName: 'Break',
          startTime: calculateStartTime(breakTime, availability.preferredTimes),
          endTime: calculateEndTime(calculateStartTime(breakTime, availability.preferredTimes), 0.25),
          duration: 15,
          type: 'break',
          day,
          difficulty: 'easy'
        });
      }
    });

    // Calculate stress index
    const averageBlockDuration = blocks.reduce((sum, block) => sum + block.duration, 0) / blocks.length;
    const hardUnitsRatio = units.filter(u => u.difficulty === 'hard').length / units.length;
    stressIndex = Math.min(100, (averageBlockDuration / 90) * 50 + hardUnitsRatio * 50);

    return {
      id: Date.now().toString(),
      blocks,
      totalHours: blocks.reduce((sum, block) => sum + (block.duration / 60), 0),
      averageDailyHours: totalAvailableHours / availability.weeklyDays.length,
      stressIndex,
      warnings
    };
  };

  const calculateStartTime = (hoursUsed: number, preferredTimes: string[]): string => {
    const baseHour = preferredTimes.includes('morning') ? 8 : 
                    preferredTimes.includes('afternoon') ? 14 : 18;
    const startHour = baseHour + Math.floor(hoursUsed);
    const startMinute = (hoursUsed % 1) * 60;
    return `${startHour.toString().padStart(2, '0')}:${startMinute.toString().padStart(2, '0')}`;
  };

  const calculateEndTime = (startTime: string, hours: number): string => {
    const [hour, minute] = startTime.split(':').map(Number);
    const totalMinutes = hour * 60 + minute + (hours * 60);
    const endHour = Math.floor(totalMinutes / 60) % 24;
    const endMinute = totalMinutes % 60;
    return `${endHour.toString().padStart(2, '0')}:${endMinute.toString().padStart(2, '0')}`;
  };

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" borderColor="gray.200" bg="white" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        <HStack spacing={3} align="center">
          <Icon as={FiZap} boxSize={5} color="orange.500" />
          <Text fontSize="lg" fontWeight="600" color="gray.800">
            Study Plan Generator
          </Text>
        </HStack>

        {units.length === 0 ? (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <AlertTitle>Add study units to generate a plan</AlertTitle>
          </Alert>
        ) : (
          <VStack spacing={4}>
            <Box p={4} bg="gray.50" borderRadius="md">
              <VStack spacing={2} align="stretch">
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">Units configured:</Text>
                  <Badge colorScheme="blue">{units.length}</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">Study days:</Text>
                  <Badge colorScheme="green">{availability.weeklyDays.length}</Badge>
                </HStack>
                <HStack justify="space-between">
                  <Text fontSize="sm" color="gray.600">Daily availability:</Text>
                  <Badge colorScheme="orange">{availability.dailyHours}h</Badge>
                </HStack>
              </VStack>
            </Box>

            {isGenerating && (
              <VStack spacing={3}>
                <Text fontSize="sm" color="gray.600">Generating optimal study plan...</Text>
                <Progress value={progress} colorScheme="blue" size="sm" borderRadius="full" />
              </VStack>
            )}

            <Button 
              colorScheme="blue" 
              size="lg" 
              onClick={generateStudyPlan}
              isLoading={isGenerating}
              loadingText="Generating..."
              disabled={units.length === 0 || availability.weeklyDays.length === 0}
            >
              Generate Study Plan
            </Button>
          </VStack>
        )}
      </VStack>
    </Box>
  );
};

export default StudyPlanGenerator;
