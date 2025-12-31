import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Heading,
  Button,
  Input,
  Badge,
  useColorModeValue,
  Icon,
} from "@chakra-ui/react";
import { FiTarget, FiPlus, FiCheck, FiX, FiEdit2 } from "react-icons/fi";

interface Goal {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  unit: string;
  deadline: string;
  completed: boolean;
  createdAt: string;
}

const GoalTracker: React.FC = () => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoal, setNewGoal] = useState({
    title: "",
    description: "",
    target: 1,
    unit: "hours",
    deadline: "",
  });

  useEffect(() => {
    const savedGoals = localStorage.getItem("studyGoals");
    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
  }, []);

  const saveGoals = (updatedGoals: Goal[]) => {
    setGoals(updatedGoals);
    localStorage.setItem("studyGoals", JSON.stringify(updatedGoals));
  };

  const addGoal = () => {
    if (!newGoal.title || !newGoal.deadline) return;

    const goal: Goal = {
      id: Date.now().toString(),
      ...newGoal,
      current: 0,
      completed: false,
      createdAt: new Date().toISOString(),
    };

    saveGoals([...goals, goal]);
    setNewGoal({
      title: "",
      description: "",
      target: 1,
      unit: "hours",
      deadline: "",
    });
    setIsAddingGoal(false);
  };

  const updateGoalProgress = (id: string, increment: number) => {
    const updatedGoals = goals.map((goal) => {
      if (goal.id === id) {
        const newCurrent = Math.min(goal.current + increment, goal.target);
        return {
          ...goal,
          current: newCurrent,
          completed: newCurrent >= goal.target,
        };
      }
      return goal;
    });
    saveGoals(updatedGoals);
  };

  const deleteGoal = (id: string) => {
    saveGoals(goals.filter((goal) => goal.id !== id));
  };

  const getProgressColor = (goal: Goal) => {
    const percentage = (goal.current / goal.target) * 100;
    if (percentage >= 100) return "green";
    if (percentage >= 75) return "blue";
    if (percentage >= 50) return "yellow";
    return "red";
  };

  const cardBg = useColorModeValue("white", "gray.800");
  const borderColor = useColorModeValue("gray.200", "gray.700");

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
            <Icon as={FiTarget} boxSize={5} color="blue.500" />
            <Heading as="h3" size="md" color="gray.900">
              Study Goals
            </Heading>
          </HStack>
          <Button
            size="sm"
            colorScheme="blue"
            leftIcon={<FiPlus />}
            onClick={() => setIsAddingGoal(true)}
          >
            Add Goal
          </Button>
        </HStack>

        {isAddingGoal && (
          <Box
            p={4}
            borderWidth={1}
            borderRadius="md"
            borderColor="blue.200"
            bg="blue.50"
          >
            <VStack spacing={3} align="stretch">
              <Input
                placeholder="Goal title"
                value={newGoal.title}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, title: e.target.value })
                }
              />
              <Input
                placeholder="Description (optional)"
                value={newGoal.description}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, description: e.target.value })
                }
              />
              <HStack spacing={3}>
                <Input
                  type="number"
                  placeholder="Target"
                  value={newGoal.target}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, target: Number(e.target.value) })
                  }
                  min={1}
                />
                <Input
                  placeholder="Unit (e.g., hours, chapters)"
                  value={newGoal.unit}
                  onChange={(e) =>
                    setNewGoal({ ...newGoal, unit: e.target.value })
                  }
                />
              </HStack>
              <Input
                type="date"
                value={newGoal.deadline}
                onChange={(e) =>
                  setNewGoal({ ...newGoal, deadline: e.target.value })
                }
              />
              <HStack spacing={3}>
                <Button size="sm" colorScheme="green" onClick={addGoal}>
                  Add Goal
                </Button>
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setIsAddingGoal(false)}
                >
                  Cancel
                </Button>
              </HStack>
            </VStack>
          </Box>
        )}

        <VStack spacing={4} align="stretch">
          {goals.length === 0 ? (
            <Text color="gray.500" textAlign="center" py={4}>
              No goals yet. Create your first study goal!
            </Text>
          ) : (
            goals.map((goal) => (
              <Box
                key={goal.id}
                p={4}
                borderWidth={1}
                borderRadius="md"
                borderColor={borderColor}
              >
                <VStack spacing={3} align="stretch">
                  <HStack justify="space-between" align="start">
                    <VStack align="start" spacing={1}>
                      <HStack spacing={2}>
                        <Text fontWeight="600" color="gray.900">
                          {goal.title}
                        </Text>
                        {goal.completed && (
                          <Badge colorScheme="green" size="sm">
                            Completed
                          </Badge>
                        )}
                      </HStack>
                      {goal.description && (
                        <Text fontSize="sm" color="gray.600">
                          {goal.description}
                        </Text>
                      )}
                      <Text fontSize="xs" color="gray.500">
                        Target: {goal.target} {goal.unit} | Deadline:{" "}
                        {new Date(goal.deadline).toLocaleDateString()}
                      </Text>
                    </VStack>
                    <Button
                      size="sm"
                      variant="ghost"
                      colorScheme="red"
                      onClick={() => deleteGoal(goal.id)}
                    >
                      <FiX />
                    </Button>
                  </HStack>

                  <HStack spacing={3} align="center">
                    <Text fontSize="sm" color="gray.700">
                      Progress: {goal.current} / {goal.target} {goal.unit}
                    </Text>
                    <Box
                      flex={1}
                      h={2}
                      bg="gray.200"
                      borderRadius="full"
                      overflow="hidden"
                    >
                      <Box
                        h="full"
                        bg={`${getProgressColor(goal)}.500`}
                        borderRadius="full"
                        transition="all 0.3s"
                        style={{
                          width: `${Math.min((goal.current / goal.target) * 100, 100)}%`,
                        }}
                      />
                    </Box>
                    <Text
                      fontSize="sm"
                      fontWeight="600"
                      color={`${getProgressColor(goal)}.500`}
                    >
                      {Math.round((goal.current / goal.target) * 100)}%
                    </Text>
                  </HStack>

                  {!goal.completed && (
                    <HStack spacing={3}>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => updateGoalProgress(goal.id, 1)}
                      >
                        +1 {goal.unit}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() =>
                          updateGoalProgress(
                            goal.id,
                            Math.ceil(goal.target * 0.1),
                          )
                        }
                      >
                        +10%
                      </Button>
                    </HStack>
                  )}
                </VStack>
              </Box>
            ))
          )}
        </VStack>
      </VStack>
    </Box>
  );
};

export default GoalTracker;
