import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Icon,
  VStack,
  HStack,
  Button,
  useColorModeValue,
} from "@chakra-ui/react";
import { FiRefreshCw, FiHeart } from "react-icons/fi";

const quotes = [
  {
    text: "The expert in anything was once a beginner.",
    author: "Helen Hayes",
  },
  {
    text: "Success is the sum of small efforts repeated day in and day out.",
    author: "Robert Collier",
  },
  {
    text: "The beautiful thing about learning is that nobody can take it away from you.",
    author: "B.B. King",
  },
  {
    text: "Education is the most powerful weapon which you can use to change the world.",
    author: "Nelson Mandela",
  },
  {
    text: "The more that you read, the more things you will know.",
    author: "Dr. Seuss",
  },
  {
    text: "Live as if you were to die tomorrow. Learn as if you were to live forever.",
    author: "Mahatma Gandhi",
  },
  {
    text: "The capacity to learn is a gift; the ability to learn is a skill; the willingness to learn is a choice.",
    author: "Brian Herbert",
  },
  { text: "Learning never exhausts the mind.", author: "Leonardo da Vinci" },
  {
    text: "The illiterate of the 21st century will not be those who cannot read and write, but those who cannot learn, unlearn, and relearn.",
    author: "Alvin Toffler",
  },
  {
    text: "Education is not preparation for life; education is life itself.",
    author: "John Dewey",
  },
  {
    text: "The only person who is educated is the one who has learned how to learn and change.",
    author: "Carl Rogers",
  },
  {
    text: "Learning is a treasure that will follow its owner everywhere.",
    author: "Chinese Proverb",
  },
];

interface MotivationalQuotesProps {
  refreshInterval?: number;
}

const MotivationalQuotes: React.FC<MotivationalQuotesProps> = ({
  refreshInterval = 30000,
}) => {
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const bgGradient = useColorModeValue(
    "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
    "linear-gradient(135deg, #4a5568 0%, #2d3748 100%)",
  );
  const textColor = useColorModeValue("white", "gray.100");

  useEffect(() => {
    const interval = setInterval(() => {
      getRandomQuote();
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [refreshInterval]);

  const getRandomQuote = () => {
    setIsRefreshing(true);
    const randomIndex = Math.floor(Math.random() * quotes.length);
    setCurrentQuote(quotes[randomIndex]);
    setTimeout(() => setIsRefreshing(false), 300);
  };

  return (
    <Box
      p={6}
      borderRadius="xl"
      bgGradient={bgGradient}
      position="relative"
      overflow="hidden"
      boxShadow="lg"
    >
      {/* Background decoration */}
      <Box
        position="absolute"
        top={-20}
        right={-20}
        w={40}
        h={40}
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.1)"
      />
      <Box
        position="absolute"
        bottom={-10}
        left={-10}
        w={20}
        h={20}
        borderRadius="full"
        bg="rgba(255, 255, 255, 0.1)"
      />

      <VStack spacing={4} align="center" position="relative" zIndex={1}>
        <Text fontSize="2xl" color={textColor} opacity={0.8}>
          "
        </Text>

        <Text
          fontSize="lg"
          fontWeight="500"
          color={textColor}
          textAlign="center"
          fontStyle="italic"
          lineHeight="1.6"
        >
          "{currentQuote.text}"
        </Text>

        <HStack spacing={2} align="center">
          <Text fontSize="sm" color={textColor} opacity={0.9}>
            — {currentQuote.author}
          </Text>
          <Icon as={FiHeart} boxSize={3} color={textColor} opacity={0.7} />
        </HStack>

        <Button
          size="sm"
          variant="ghost"
          color={textColor}
          leftIcon={<FiRefreshCw />}
          onClick={getRandomQuote}
          isLoading={isRefreshing}
          _hover={{ bg: "rgba(255, 255, 255, 0.1)" }}
        >
          New Quote
        </Button>
      </VStack>
    </Box>
  );
};

export default MotivationalQuotes;
