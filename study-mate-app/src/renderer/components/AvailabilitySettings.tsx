import React, { useState } from "react";
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  Select,
  Checkbox,
  CheckboxGroup,
  Stack,
  Icon,
  Divider,
  useToast,
} from "@chakra-ui/react";
import { FiClock, FiCalendar, FiSun } from "react-icons/fi";

export interface Availability {
  dailyHours: number;
  weeklyDays: string[];
  preferredTimes: string[];
  studyPreference: "long" | "short" | "mixed";
}

interface AvailabilitySettingsProps {
  availability: Availability;
  onAvailabilityChange: (availability: Availability) => void;
}

const AvailabilitySettings: React.FC<AvailabilitySettingsProps> = ({
  availability,
  onAvailabilityChange,
}) => {
  const toast = useToast();

  const weekDays = [
    { value: "monday", label: "Monday" },
    { value: "tuesday", label: "Tuesday" },
    { value: "wednesday", label: "Wednesday" },
    { value: "thursday", label: "Thursday" },
    { value: "friday", label: "Friday" },
    { value: "saturday", label: "Saturday" },
    { value: "sunday", label: "Sunday" },
  ];

  const timePreferences = [
    { value: "morning", label: "Morning (6AM - 12PM)" },
    { value: "afternoon", label: "Afternoon (12PM - 6PM)" },
    { value: "evening", label: "Evening (6PM - 12AM)" },
  ];

  const handleWeeklyDaysChange = (values: string[]) => {
    onAvailabilityChange({ ...availability, weeklyDays: values });
  };

  const handlePreferredTimesChange = (values: string[]) => {
    onAvailabilityChange({ ...availability, preferredTimes: values });
  };

  const calculateTotalWeeklyHours = () => {
    return availability.dailyHours * availability.weeklyDays.length;
  };

  return (
    <Box
      p={6}
      borderWidth={1}
      borderRadius="lg"
      borderColor="gray.200"
      bg="white"
      boxShadow="sm"
    >
      <VStack spacing={6} align="stretch">
        <HStack spacing={3} align="center">
          <Icon as={FiClock} boxSize={5} color="blue.500" />
          <Text fontSize="lg" fontWeight="600" color="gray.800">
            Study Availability
          </Text>
        </HStack>

        <FormControl>
          <FormLabel>Daily Study Hours</FormLabel>
          <NumberInput
            min={0.5}
            max={12}
            step={0.5}
            value={availability.dailyHours}
            onChange={(value) =>
              onAvailabilityChange({
                ...availability,
                dailyHours: parseFloat(value) || 1,
              })
            }
          >
            <NumberInputField />
            <NumberInputStepper>
              <NumberIncrementStepper />
              <NumberDecrementStepper />
            </NumberInputStepper>
          </NumberInput>
          <Text fontSize="sm" color="gray.600" mt={1}>
            Total weekly: {calculateTotalWeeklyHours()} hours
          </Text>
        </FormControl>

        <FormControl>
          <FormLabel>Study Days</FormLabel>
          <CheckboxGroup
            value={availability.weeklyDays}
            onChange={handleWeeklyDaysChange}
          >
            <Stack spacing={2}>
              {weekDays.map((day) => (
                <Checkbox key={day.value} value={day.value}>
                  {day.label}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Preferred Study Times</FormLabel>
          <CheckboxGroup
            value={availability.preferredTimes}
            onChange={handlePreferredTimesChange}
          >
            <Stack spacing={2}>
              {timePreferences.map((time) => (
                <Checkbox key={time.value} value={time.value}>
                  {time.label}
                </Checkbox>
              ))}
            </Stack>
          </CheckboxGroup>
        </FormControl>

        <FormControl>
          <FormLabel>Study Preference</FormLabel>
          <Select
            value={availability.studyPreference}
            onChange={(e) =>
              onAvailabilityChange({
                ...availability,
                studyPreference: e.target.value as any,
              })
            }
          >
            <option value="long">Long blocks (60-90 min)</option>
            <option value="short">Short sprints (25-30 min)</option>
            <option value="mixed">Mixed approach</option>
          </Select>
        </FormControl>

        <Divider />

        <Box p={4} bg="blue.50" borderRadius="md">
          <VStack spacing={2} align="stretch">
            <Text fontWeight="600" color="blue.800">
              Schedule Summary
            </Text>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.700">
                Study days per week:
              </Text>
              <Text fontSize="sm" fontWeight="600">
                {availability.weeklyDays.length}
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.700">
                Total weekly hours:
              </Text>
              <Text fontSize="sm" fontWeight="600">
                {calculateTotalWeeklyHours()}h
              </Text>
            </HStack>
            <HStack justify="space-between">
              <Text fontSize="sm" color="gray.700">
                Preferred format:
              </Text>
              <Text fontSize="sm" fontWeight="600">
                {availability.studyPreference === "long"
                  ? "Long blocks"
                  : availability.studyPreference === "short"
                    ? "Short sprints"
                    : "Mixed"}
              </Text>
            </HStack>
          </VStack>
        </Box>
      </VStack>
    </Box>
  );
};

export default AvailabilitySettings;
