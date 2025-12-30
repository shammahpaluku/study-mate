import React, { useState, useEffect } from 'react';
import { Box, VStack, HStack, Text, Heading, Container, Grid, GridItem, useColorModeValue } from '@chakra-ui/react';
import StudyAnalytics from '../components/StudyAnalytics';
import StudyCalendar from '../components/StudyCalendar';
import StudyStreak from '../components/StudyStreak';
import { useNotifications } from '../components/Notifications';

const AnalyticsPage: React.FC = () => {
  const { addNotification } = useNotifications();

  useEffect(() => {
    addNotification({
      title: 'Analytics Dashboard',
      message: 'Track your learning patterns and progress',
      type: 'info'
    });
  }, []);

  const bg = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box>
          <Heading as="h1" size="2xl" color="gray.900" mb={2}>
            Study Analytics
          </Heading>
          <Text color="gray.600" fontSize="lg">
            Visualize your learning progress and identify patterns
          </Text>
        </Box>

        <Grid templateColumns={{ base: '1fr', lg: '2fr 1fr' }} gap={6}>
          <GridItem>
            <VStack spacing={6}>
              <StudyAnalytics />
              <StudyCalendar />
            </VStack>
          </GridItem>

          <GridItem>
            <VStack spacing={6}>
              <StudyStreak />
            </VStack>
          </GridItem>
        </Grid>
      </VStack>
    </Container>
  );
};

export default AnalyticsPage;
