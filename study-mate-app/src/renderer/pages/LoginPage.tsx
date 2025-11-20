import React, { useState } from 'react';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  Box,
  Flex,
  Stack,
  Heading,
  Text,
  FormControl,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  Button,
  Link,
  useColorModeValue,
  useToast,
  FormErrorMessage,
  Icon,
} from '@chakra-ui/react';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

interface LoginFormData {
  email: string;
  password: string;
}

const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup.string().required('Password is required'),
});

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: yupResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      await login(data.email, data.password);
      toast({
        title: 'Login successful',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate('/dashboard');
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: 'Login failed',
        description: 'Invalid email or password. Please try again.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Flex minH="100vh" align="center" justify="center" bg={bgColor} p={4}>
      <Stack spacing={8} mx="auto" maxW="lg" py={12} px={6} w="full">
        <Stack align="center">
          <Heading fontSize="4xl" textAlign="center">
            Welcome back
          </Heading>
          <Text fontSize="lg" color="gray.600" _dark={{ color: 'gray.400' }}>
            Sign in to your account to continue
          </Text>
        </Stack>
        <Box
          rounded="lg"
          bg={cardBg}
          boxShadow="lg"
          p={8}
          borderWidth="1px"
          borderColor={borderColor}
        >
          <form onSubmit={handleSubmit(onSubmit)}>
            <Stack spacing={6}>
              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>Email address</FormLabel>
                <InputGroup>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    leftElement={<Icon as={FiMail} color="gray.400" />}
                    {...register('email')}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.email && errors.email.message}
                </FormErrorMessage>
              </FormControl>
              <FormControl id="password" isInvalid={!!errors.password}>
                <FormLabel>Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter your password"
                    leftElement={<Icon as={FiLock} color="gray.400" />}
                    {...register('password')}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowPassword(!showPassword)}
                      variant="ghost"
                    >
                      {showPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.password && errors.password.message}
                </FormErrorMessage>
              </FormControl>
              <Stack spacing={4} pt={2}>
                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                  loadingText="Signing in..."
                >
                  Sign in
                </Button>
                <Flex justify="flex-end">
                  <Link
                    as={RouterLink}
                    to="/forgot-password"
                    color="primary.500"
                    fontSize="sm"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Forgot password?
                  </Link>
                </Flex>
              </Stack>
              <Stack pt={2}>
                <Text align="center">
                  Don't have an account?{' '}
                  <Link
                    as={RouterLink}
                    to="/register"
                    color="primary.500"
                    fontWeight="medium"
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Sign up
                  </Link>
                </Text>
              </Stack>
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default LoginPage;
