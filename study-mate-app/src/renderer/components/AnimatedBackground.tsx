import React from "react";
import { Box, useColorModeValue } from "@chakra-ui/react";

const AnimatedBackground: React.FC = () => {
  const bgColor = useColorModeValue("gray.50", "gray.900");

  return (
    <Box
      position="fixed"
      top={0}
      left={0}
      right={0}
      bottom={0}
      bg={bgColor}
      zIndex={-1}
      overflow="hidden"
    >
      <Box
        position="absolute"
        top="10%"
        left="10%"
        w={200}
        h={200}
        bgGradient="radial-gradient(circle, rgba(99, 102, 241, 0.1) 0%, transparent 70%)"
        borderRadius="full"
        animation="float 6s ease-in-out infinite"
      />
      <Box
        position="absolute"
        top="60%"
        right="15%"
        w={150}
        h={150}
        bgGradient="radial-gradient(circle, rgba(236, 72, 153, 0.1) 0%, transparent 70%)"
        borderRadius="full"
        animation="float 8s ease-in-out infinite reverse"
      />
      <Box
        position="absolute"
        bottom="20%"
        left="20%"
        w={100}
        h={100}
        bgGradient="radial-gradient(circle, rgba(34, 197, 94, 0.1) 0%, transparent 70%)"
        borderRadius="full"
        animation="float 7s ease-in-out infinite"
      />

      <style>{`
        @keyframes float {
          0%, 100% {
            transform: translateY(0px) scale(1);
          }
          50% {
            transform: translateY(-20px) scale(1.05);
          }
        }
      `}</style>
    </Box>
  );
};

export default AnimatedBackground;
