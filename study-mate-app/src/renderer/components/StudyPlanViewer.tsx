import React, { useState } from 'react';
import { 
  Box, VStack, HStack, Text, Badge, Icon, Button, 
  Divider, Alert, AlertIcon, Progress, useToast,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from '@chakra-ui/react';
import { FiCalendar, FiClock, FiTarget, FiZap, FiAlertTriangle, FiDownload } from 'react-icons/fi';
import { GeneratedPlan, StudyBlock } from './StudyPlanGenerator';

interface StudyPlanViewerProps {
  plan: GeneratedPlan;
}

const StudyPlanViewer: React.FC<StudyPlanViewerProps> = ({ plan }) => {
  const [selectedDay, setSelectedDay] = useState<string>('');
  const toast = useToast();

  const getDaysFromPlan = (): string[] => {
    const days = [...new Set(plan.blocks.map(block => block.day))];
    return days.sort();
  };

  const getBlocksForDay = (day: string): StudyBlock[] => {
    return plan.blocks.filter(block => block.day === day)
      .sort((a, b) => a.startTime.localeCompare(b.startTime));
  };

  const getBlockTypeColor = (type: string) => {
    const colors = {
      'deep-focus': 'blue',
      'sprint': 'green',
      'revision': 'purple',
      'break': 'gray'
    };
    return colors[type as keyof typeof colors] || 'gray';
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      'easy': 'green',
      'moderate': 'yellow',
      'hard': 'red'
    };
    return colors[difficulty as keyof typeof colors] || 'gray';
  };

  const getStressColor = (index: number) => {
    if (index < 30) return 'green';
    if (index < 60) return 'yellow';
    return 'red';
  };

  const handleExportPlan = () => {
    const planText = generatePlanText();
    const blob = new Blob([planText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `study-plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      title: "Plan exported",
      description: "Study plan has been downloaded as a text file",
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const generatePlanText = (): string => {
    const days = getDaysFromPlan();
    let text = "STUDY PLAN\n";
    text += "============\n\n";
    text += `Generated: ${new Date().toLocaleDateString()}\n`;
    text += `Total Hours: ${plan.totalHours.toFixed(1)}h\n`;
    text += `Average Daily: ${plan.averageDailyHours.toFixed(1)}h\n`;
    text += `Stress Index: ${plan.stressIndex.toFixed(0)}%\n\n`;

    if (plan.warnings.length > 0) {
      text += "WARNINGS:\n";
      plan.warnings.forEach(warning => {
        text += `- ${warning}\n`;
      });
      text += "\n";
    }

    days.forEach(day => {
      text += `${day.toUpperCase()}\n${'-'.repeat(day.length)}\n`;
      const dayBlocks = getBlocksForDay(day);
      dayBlocks.forEach(block => {
        text += `${block.startTime} - ${block.endTime}: ${block.unitName} (${block.type})\n`;
      });
      text += "\n";
    });

    return text;
  };

  const days = getDaysFromPlan();

  return (
    <Box p={6} borderWidth={1} borderRadius="lg" borderColor="gray.200" bg="white" boxShadow="sm">
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <HStack spacing={3} align="center">
            <Icon as={FiCalendar} boxSize={5} color="blue.500" />
            <Text fontSize="lg" fontWeight="600" color="gray.800">
              Generated Study Plan
            </Text>
          </HStack>
          <Button 
            leftIcon={<FiDownload />} 
            size="sm" 
            variant="outline"
            onClick={handleExportPlan}
          >
            Export
          </Button>
        </HStack>

        {/* Plan Summary */}
        <Box p={4} bg="blue.50" borderRadius="md">
          <VStack spacing={3} align="stretch">
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.700">Total Study Hours:</Text>
              <Text fontSize="sm" fontWeight="600">{plan.totalHours.toFixed(1)}h</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.700">Daily Average:</Text>
              <Text fontSize="sm" fontWeight="600">{plan.averageDailyHours.toFixed(1)}h</Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.700">Study Blocks:</Text>
              <Text fontSize="sm" fontWeight="600">{plan.blocks.length}</Text>
            </HStack>
            <HStack justify="space-between" align="center">
              <Text fontSize="sm" color="gray.700">Stress Index:</Text>
              <HStack spacing={2}>
                <Progress 
                  value={plan.stressIndex} 
                  colorScheme={getStressColor(plan.stressIndex)} 
                  size="sm" 
                  width="100px"
                />
                <Text fontSize="sm" fontWeight="600">{plan.stressIndex.toFixed(0)}%</Text>
              </HStack>
            </HStack>
          </VStack>
        </Box>

        {/* Warnings */}
        {plan.warnings.length > 0 && (
          <Alert status="warning" borderRadius="md">
            <AlertIcon />
            <Box>
              <Text fontWeight="600" mb={2}>Recommendations:</Text>
              <VStack spacing={1} align="stretch">
                {plan.warnings.map((warning, index) => (
                  <Text key={index} fontSize="sm">{warning}</Text>
                ))}
              </VStack>
            </Box>
          </Alert>
        )}

        {/* Study Schedule */}
        <Tabs>
          <TabList>
            {days.map(day => (
              <Tab key={day} onClick={() => setSelectedDay(day)}>
                {day.charAt(0).toUpperCase() + day.slice(1, 3)}
              </Tab>
            ))}
          </TabList>
          
          <TabPanels>
            {days.map(day => {
              const dayBlocks = getBlocksForDay(day);
              return (
                <TabPanel key={day}>
                  <VStack spacing={3} align="stretch">
                    <Text fontWeight="600" color="gray.800">
                      {day.charAt(0).toUpperCase() + day.slice(1)} Schedule
                    </Text>
                    
                    {dayBlocks.length === 0 ? (
                      <Box p={4} bg="gray.50" borderRadius="md" textAlign="center">
                        <Text color="gray.600">No study blocks scheduled</Text>
                      </Box>
                    ) : (
                      <VStack spacing={2} align="stretch">
                        {dayBlocks.map(block => (
                          <Box 
                            key={block.id}
                            p={3} 
                            borderWidth={1} 
                            borderRadius="md" 
                            borderColor="gray.200"
                            bg="white"
                          >
                            <HStack justify="space-between" align="flex-start">
                              <VStack spacing={1} align="flex-start" flex={1}>
                                <HStack spacing={2}>
                                  <Text fontWeight="600" color="gray.900">
                                    {block.unitName}
                                  </Text>
                                  <Badge colorScheme={getBlockTypeColor(block.type)} size="sm">
                                    {block.type}
                                  </Badge>
                                  <Badge colorScheme={getDifficultyColor(block.difficulty)} size="sm">
                                    {block.difficulty}
                                  </Badge>
                                </HStack>
                                
                                <HStack spacing={4} color="gray.600" fontSize="sm">
                                  <HStack spacing={1}>
                                    <Icon as={FiClock} boxSize={3} />
                                    <Text>{block.startTime} - {block.endTime}</Text>
                                  </HStack>
                                  <Text>{block.duration} min</Text>
                                </HStack>
                              </VStack>
                            </HStack>
                          </Box>
                        ))}
                      </VStack>
                    )}
                  </VStack>
                </TabPanel>
              );
            })}
          </TabPanels>
        </Tabs>
      </VStack>
    </Box>
  );
};

export default StudyPlanViewer;
