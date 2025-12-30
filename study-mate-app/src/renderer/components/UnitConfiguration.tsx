import React, { useState } from 'react';
import { 
  Box, VStack, HStack, Text, Button, Input, Select, 
  NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper,
  FormControl, FormLabel, FormErrorMessage, Icon, Divider, IconButton,
  useToast, Modal, ModalOverlay, ModalContent, ModalHeader, ModalBody, ModalCloseButton,
  useDisclosure, Badge
} from '@chakra-ui/react';
import { FiPlus, FiTrash2, FiCalendar, FiTarget, FiClock } from 'react-icons/fi';

export interface Unit {
  id: string;
  name: string;
  difficulty: 'easy' | 'moderate' | 'hard';
  type: 'exam' | 'practical' | 'project';
  assessmentDate?: string;
  weightScore: number;
}

interface UnitConfigurationProps {
  units: Unit[];
  onUnitsChange: (units: Unit[]) => void;
}

const UnitConfiguration: React.FC<UnitConfigurationProps> = ({ units, onUnitsChange }) => {
  const [newUnit, setNewUnit] = useState<Partial<Unit>>({
    name: '',
    difficulty: 'moderate',
    type: 'exam',
    assessmentDate: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const calculateWeight = (difficulty: string, type: string): number => {
    const difficultyScores = { easy: 1, moderate: 2, hard: 3 };
    const typeMultipliers = { exam: 1.5, practical: 1.2, project: 1.0 };
    return difficultyScores[difficulty as keyof typeof difficultyScores] * 
           typeMultipliers[type as keyof typeof typeMultipliers];
  };

  const validateUnit = (unit: Partial<Unit>): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!unit.name?.trim()) {
      newErrors.name = 'Unit name is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddUnit = () => {
    if (!validateUnit(newUnit)) return;

    const unit: Unit = {
      id: Date.now().toString(),
      name: newUnit.name!,
      difficulty: newUnit.difficulty!,
      type: newUnit.type!,
      assessmentDate: newUnit.assessmentDate,
      weightScore: calculateWeight(newUnit.difficulty!, newUnit.type!)
    };

    onUnitsChange([...units, unit]);
    setNewUnit({
      name: '',
      difficulty: 'moderate',
      type: 'exam',
      assessmentDate: ''
    });
    setErrors({});
    onClose();
    
    toast({
      title: "Unit added",
      description: `${unit.name} has been added to your study plan`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  const handleRemoveUnit = (id: string) => {
    const unit = units.find(u => u.id === id);
    onUnitsChange(units.filter(u => u.id !== id));
    
    toast({
      title: "Unit removed",
      description: `${unit?.name} has been removed from your study plan`,
      status: "info",
      duration: 3000,
      isClosable: true,
    });
  };

  const getDifficultyColor = (difficulty: string) => {
    const colors = { easy: 'green', moderate: 'yellow', hard: 'red' };
    return colors[difficulty as keyof typeof colors];
  };

  const getTypeColor = (type: string) => {
    const colors = { exam: 'blue', practical: 'purple', project: 'orange' };
    return colors[type as keyof typeof colors];
  };

  return (
    <Box>
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="600" color="gray.800">
            Study Units ({units.length})
          </Text>
          <Button leftIcon={<FiPlus />} colorScheme="blue" onClick={onOpen}>
            Add Unit
          </Button>
        </HStack>

        {units.length === 0 ? (
          <Box 
            p={8} 
            borderWidth={1} 
            borderRadius="lg" 
            borderColor="gray.200"
            bg="white"
            boxShadow="sm"
            textAlign="center"
          >
            <VStack spacing={3}>
              <Icon as={FiTarget} boxSize={12} color="gray.400" />
              <Text color="gray.600" fontSize="lg">
                No units configured yet
              </Text>
              <Text color="gray.500" fontSize="sm">
                Add your first study unit to get started with planning
              </Text>
            </VStack>
          </Box>
        ) : (
          <VStack spacing={3} align="stretch">
            {units.map((unit) => (
              <Box 
                key={unit.id}
                p={4} 
                borderWidth={1} 
                borderRadius="lg" 
                borderColor="gray.200"
                bg="white"
                boxShadow="sm"
              >
                <HStack justify="space-between" align="flex-start">
                  <VStack spacing={2} align="flex-start" flex={1}>
                    <Text fontWeight="600" color="gray.900" fontSize="md">
                      {unit.name}
                    </Text>
                    
                    <HStack spacing={2}>
                      <Badge colorScheme={getDifficultyColor(unit.difficulty)} size="sm">
                        {unit.difficulty}
                      </Badge>
                      <Badge colorScheme={getTypeColor(unit.type)} size="sm">
                        {unit.type}
                      </Badge>
                      <Badge colorScheme="gray" size="sm">
                        Weight: {unit.weightScore.toFixed(1)}
                      </Badge>
                    </HStack>

                    {unit.assessmentDate && (
                      <HStack spacing={1} color="gray.600" fontSize="sm">
                        <Icon as={FiCalendar} boxSize={3} />
                        <Text>Assessment: {new Date(unit.assessmentDate).toLocaleDateString()}</Text>
                      </HStack>
                    )}
                  </VStack>

                  <IconButton
                    aria-label="Remove unit"
                    icon={<FiTrash2 />}
                    size="sm"
                    colorScheme="red"
                    variant="ghost"
                    onClick={() => handleRemoveUnit(unit.id)}
                  />
                </HStack>
              </Box>
            ))}
          </VStack>
        )}
      </VStack>

      <Modal isOpen={isOpen} onClose={onClose} size="md">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Study Unit</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name}>
                <FormLabel>Unit Name</FormLabel>
                <Input
                  placeholder="e.g., Mathematics 101"
                  value={newUnit.name}
                  onChange={(e) => setNewUnit({ ...newUnit, name: e.target.value })}
                />
                <FormErrorMessage>{errors.name}</FormErrorMessage>
              </FormControl>

              <FormControl>
                <FormLabel>Difficulty Level</FormLabel>
                <Select
                  value={newUnit.difficulty}
                  onChange={(e) => setNewUnit({ ...newUnit, difficulty: e.target.value as any })}
                >
                  <option value="easy">Easy</option>
                  <option value="moderate">Moderate</option>
                  <option value="hard">Hard</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Unit Type</FormLabel>
                <Select
                  value={newUnit.type}
                  onChange={(e) => setNewUnit({ ...newUnit, type: e.target.value as any })}
                >
                  <option value="exam">Exam</option>
                  <option value="practical">Practical</option>
                  <option value="project">Project</option>
                </Select>
              </FormControl>

              <FormControl>
                <FormLabel>Assessment Date (Optional)</FormLabel>
                <Input
                  type="date"
                  value={newUnit.assessmentDate}
                  onChange={(e) => setNewUnit({ ...newUnit, assessmentDate: e.target.value })}
                />
              </FormControl>

              <HStack spacing={3} w="100%">
                <Button onClick={onClose} variant="outline" flex={1}>
                  Cancel
                </Button>
                <Button 
                  colorScheme="blue" 
                  onClick={handleAddUnit}
                  flex={1}
                >
                  Add Unit
                </Button>
              </HStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UnitConfiguration;
