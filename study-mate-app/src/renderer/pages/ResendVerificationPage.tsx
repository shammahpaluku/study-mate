import React, { useState } from "react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Icon,
  Link,
  VStack,
  FormErrorMessage,
} from "@chakra-ui/react";
import { FiMail, FiArrowLeft, FiCheckCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

interface ResendVerificationFormData {
  email: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email("Please enter a valid email")
    .required("Email is required"),
});

const ResendVerificationPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue("white", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const borderColor = useColorModeValue("gray.200", "gray.600");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResendVerificationFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ResendVerificationFormData) => {
    try {
      setIsLoading(true);
      // TODO: Implement API call to resend verification email
      // await authService.resendVerificationEmail(data.email);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      setIsEmailSent(true);
      toast({
        title: "Email sent",
        description: "Check your email for a new verification link.",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error resending verification email:", error);
      toast({
        title: "Error",
        description: "Failed to send verification email. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isEmailSent) {
    return (
      <Flex minH="100vh" align="center" justify="center" bg={bgColor} p={4}>
        <Box
          rounded="lg"
          bg={cardBg}
          boxShadow="lg"
          p={8}
          maxW="md"
          w="full"
          borderWidth="1px"
          borderColor={borderColor}
          textAlign="center"
        >
          <VStack spacing={6}>
            <Box
              mx="auto"
              display="flex"
              alignItems="center"
              justifyContent="center"
              bg="green.100"
              color="green.500"
              w={16}
              h={16}
              rounded="full"
            >
              <Icon as={FiCheckCircle} boxSize={8} />
            </Box>
            <Heading size="lg">Verification Email Sent</Heading>
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              We've sent a new verification link to your email address. Please
              check your inbox and follow the instructions to verify your
              account.
            </Text>
            <Text color="gray.600" _dark={{ color: "gray.400" }}>
              If you don't see the email, please check your spam folder.
            </Text>
            <Button
              as={RouterLink}
              to="/login"
              colorScheme="primary"
              size="lg"
              width="full"
              mt={4}
            >
              Back to Login
            </Button>
          </VStack>
        </Box>
      </Flex>
    );
  }

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bgColor} p={4}>
      <Box
        rounded="lg"
        bg={cardBg}
        boxShadow="lg"
        p={8}
        maxW="md"
        w="full"
        borderWidth="1px"
        borderColor={borderColor}
      >
        <Box mb={8}>
          <Button
            as={RouterLink}
            to="/login"
            leftIcon={<FiArrowLeft />}
            variant="ghost"
            mb={6}
            pl={0}
          >
            Back to login
          </Button>
          <Heading as="h1" size="lg" mb={2}>
            Resend Verification Email
          </Heading>
          <Text color="gray.600" _dark={{ color: "gray.400" }}>
            Enter your email address and we'll send you a new verification link.
          </Text>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={6}>
            <FormControl id="email" isInvalid={!!errors.email}>
              <FormLabel>Email address</FormLabel>
              <InputGroup>
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiMail} color="gray.400" />
                </InputLeftElement>
                <Input
                  type="email"
                  placeholder="your@email.com"
                  {...register("email")}
                />
              </InputGroup>
              <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
            </FormControl>

            <Button
              type="submit"
              colorScheme="primary"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Sending..."
            >
              Send Verification Email
            </Button>

            <Text textAlign="center" mt={4}>
              Remembered your password?{" "}
              <Link
                as={RouterLink}
                to="/login"
                color="primary.500"
                fontWeight="medium"
                _hover={{ textDecoration: "underline" }}
              >
                Sign in
              </Link>
            </Text>
          </Stack>
        </form>
      </Box>
    </Flex>
  );
};

export default ResendVerificationPage;
