import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
} from '@chakra-ui/react';
import { FiMail, FiArrowLeft } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

interface ForgotPasswordFormData {
  email: string;
}

const schema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
});

const ForgotPasswordPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      setIsLoading(true);
      // TODO: Implement API call to send reset password email
      // await authService.forgotPassword(data.email);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setEmailSent(true);
      toast({
        title: 'Email sent',
        description: 'Check your email for a link to reset your password.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error sending reset email:', error);
      toast({
        title: 'Error',
        description: 'Failed to send reset email. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (emailSent) {
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
          <Stack spacing={6} textAlign="center">
            <Box p={4}>
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
                mb={4}
              >
                <Icon as={FiMail} boxSize={6} />
              </Box>
              <Heading as="h1" size="lg" mb={2}>
                Check your email
              </Heading>
              <Text color="gray.600" _dark={{ color: 'gray.400' }}>
                We've sent a password reset link to your email address. The link will expire in 1 hour.
              </Text>
            </Box>
            <Button
              as={RouterLink}
              to="/login"
              colorScheme="primary"
              size="lg"
              width="full"
              mt={4}
            >
              Back to login
            </Button>
          </Stack>
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
            Forgot your password?
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            Enter your email and we'll send you a link to reset your password.
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
                  {...register('email')}
                />
              </InputGroup>
              <Text color="red.500" mt={1} fontSize="sm">
                {errors.email?.message}
              </Text>
            </FormControl>

            <Button
              type="submit"
              colorScheme="primary"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Sending..."
            >
              Send reset link
            </Button>

            <Text textAlign="center" mt={4}>
              Remember your password?{' '}
              <Link
                as={RouterLink}
                to="/login"
                color="primary.500"
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
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

export default ForgotPasswordPage;
