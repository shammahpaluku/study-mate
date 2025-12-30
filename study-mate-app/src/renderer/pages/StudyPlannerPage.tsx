import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Heading, Container, Grid, GridItem, Divider } from '@chakra-ui/react';
import UnitConfiguration, { Unit } from '../components/UnitConfiguration';
import AvailabilitySettings, { Availability } from '../components/AvailabilitySettings';
import StudyPlanGenerator, { GeneratedPlan } from '../components/StudyPlanGenerator';
import StudyPlanViewer from '../components/StudyPlanViewer';

const StudyPlannerPage: React.FC = () => {
  const [units, setUnits] = useState<Unit[]>([]);
  const [availability, setAvailability] = useState<Availability>({
    dailyHours: 2,
    weeklyDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
    preferredTimes: ['evening'],
    studyPreference: 'mixed'
  });
  const [generatedPlan, setGeneratedPlan] = useState<GeneratedPlan | null>(null);

  // Load units from localStorage on component mount
  useEffect(() => {
    const savedUnits = localStorage.getItem('studyUnits');
    if (savedUnits) {
      try {
        const parsedUnits = JSON.parse(savedUnits);
        setUnits(parsedUnits);
      } catch (error) {
        console.error('Error loading units:', error);
      }
    }

    const savedAvailability = localStorage.getItem('studyAvailability');
    if (savedAvailability) {
      try {
        const parsedAvailability = JSON.parse(savedAvailability);
        setAvailability(parsedAvailability);
      } catch (error) {
        console.error('Error loading availability:', error);
      }
    }

    const savedPlan = localStorage.getItem('studyPlan');
    if (savedPlan) {
      try {
        const parsedPlan = JSON.parse(savedPlan);
        setGeneratedPlan(parsedPlan);
      } catch (error) {
        console.error('Error loading plan:', error);
      }
    }
  }, []);

  const handleUnitsChange = (newUnits: Unit[]) => {
    setUnits(newUnits);
    // Save to localStorage
    localStorage.setItem('studyUnits', JSON.stringify(newUnits));
    
    // Clear existing plan if units change
    if (generatedPlan) {
      setGeneratedPlan(null);
      localStorage.removeItem('studyPlan');
    }
  };

  const handleAvailabilityChange = (newAvailability: Availability) => {
    setAvailability(newAvailability);
    // Save to localStorage
    localStorage.setItem('studyAvailability', JSON.stringify(newAvailability));
    
    // Clear existing plan if availability changes
    if (generatedPlan) {
      setGeneratedPlan(null);
      localStorage.removeItem('studyPlan');
    }
  };

  const handlePlanGenerated = (plan: GeneratedPlan) => {
    setGeneratedPlan(plan);
    // Save to localStorage
    localStorage.setItem('studyPlan', JSON.stringify(plan));
  };

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" color="gray.900" mb={2}>
            Study Planner
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Configure your units and availability to generate a personalized study schedule
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '1fr 1fr' }} gap={6}>
          <GridItem>
            <VStack spacing={6}>
              <UnitConfiguration units={units} onUnitsChange={handleUnitsChange} />
              <AvailabilitySettings 
                availability={availability} 
                onAvailabilityChange={handleAvailabilityChange} 
              />
            </VStack>
          </GridItem>

          <GridItem>
            <VStack spacing={6}>
              <StudyPlanGenerator 
                units={units} 
                availability={availability} 
                onPlanGenerated={handlePlanGenerated} 
              />
              
              {generatedPlan && (
                <>
                  <Divider />
                  <StudyPlanViewer plan={generatedPlan} />
                </>
              )}
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
};

export default StudyPlannerPage;
