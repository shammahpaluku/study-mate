import React from "react";
import {
  Box,
  Progress,
  Text,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";

interface ProgressBarProps {
  value: number;
  max: number;
  label?: string;
  colorScheme?: "blue" | "green" | "yellow" | "red" | "purple" | "pink";
  size?: "sm" | "md" | "lg";
  showPercentage?: boolean;
  animated?: boolean;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  value,
  max,
  label,
  colorScheme = "blue",
  size = "md",
  showPercentage = true,
  animated = true,
}) => {
  const percentage = Math.min((value / max) * 100, 100);
  const textColor = useColorModeValue("gray.700", "gray.300");

  const getSizeProps = () => {
    switch (size) {
      case "sm":
        return { h: 2, fontSize: "xs" };
      case "lg":
        return { h: 8, fontSize: "md" };
      default:
        return { h: 4, fontSize: "sm" };
    }
  };

  const { h, fontSize } = getSizeProps();

  return (
    <Box w="100%">
      {label && (
        <HStack justify="space-between" mb={2}>
          <Text fontSize={fontSize} color={textColor} fontWeight="500">
            {label}
          </Text>
          {showPercentage && (
            <Text fontSize={fontSize} color={textColor} fontWeight="600">
              {percentage.toFixed(0)}%
            </Text>
          )}
        </HStack>
      )}

      <Progress
        value={percentage}
        colorScheme={colorScheme}
        size={size}
        borderRadius="full"
        hasStripe={animated}
        isAnimated={animated}
        bg={useColorModeValue("gray.200", "gray.700")}
      />

      <HStack justify="space-between" mt={1}>
        <Text fontSize="xs" color={textColor} opacity={0.7}>
          {value} / {max}
        </Text>
        {showPercentage && (
          <Text fontSize="xs" color={textColor} opacity={0.7}>
            {percentage.toFixed(1)}%
          </Text>
        )}
      </HStack>
    </Box>
  );
};

export default ProgressBar;
