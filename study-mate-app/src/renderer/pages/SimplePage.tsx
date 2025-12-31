import React from "react";
import {
  Box,
  Text,
  Button,
  VStack,
  Heading,
  Container,
  HStack,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { FiBarChart2, FiCalendar } from "react-icons/fi";

const SimplePage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <Container maxW="container.md" py={8}>
      <VStack spacing={8} align="center">
        <Heading as="h1" size="3xl" color="blue.600">
          Study Mate
        </Heading>

        <Text fontSize="xl" color="gray.600" textAlign="center">
          Your intelligent study companion for academic success
        </Text>

        <Box
          p={8}
          borderWidth={1}
          borderRadius="lg"
          boxShadow="md"
          bg="white"
          minW="500px"
        >
          <VStack spacing={6}>
            <Heading as="h2" size="xl" textAlign="center">
              Get Started
            </Heading>

            <Text fontSize="lg" textAlign="center" color="gray.600">
              Track progress, create study plans, and optimize your learning
            </Text>

            <VStack spacing={4} width="100%">
              <Button
                colorScheme="green"
                onClick={() => navigate("/dashboard")}
                leftIcon={<FiBarChart2 />}
                size="lg"
              >
                Go to Dashboard
              </Button>
              <Button
                colorScheme="blue"
                onClick={() => navigate("/planner")}
                variant="outline"
                leftIcon={<FiCalendar />}
                size="lg"
              >
                Create Study Plan
              </Button>
            </VStack>
          </VStack>
        </Box>
      </VStack>
    </Container>
  );
};

export default SimplePage;
