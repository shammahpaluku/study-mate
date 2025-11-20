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
  Select,
} from '@chakra-ui/react';
import { FiMail, FiLock, FiUser, FiEye, FiEyeOff, FiBook } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useAuth } from '../contexts/AuthContext';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  academicLevel: string;
  institution?: string;
}

const registerSchema = yup.object().shape({
  name: yup.string().required('Full name is required'),
  email: yup
    .string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  academicLevel: yup.string().required('Academic level is required'),
  institution: yup.string(),
});

const academicLevels = [
  'High School',
  'Undergraduate',
  'Graduate',
  'Postgraduate',
  'Professional',
  'Other',
];

const RegisterPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: yupResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      await registerUser({
        name: data.name,
        email: data.email,
        password: data.password,
        academicLevel: data.academicLevel,
        institution: data.institution || '',
      });
      
      toast({
        title: 'Account created',
        description: 'Your account has been created successfully!',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      
      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: 'Registration failed',
        description: 'An error occurred while creating your account. Please try again.',
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
            Create an account
          </Heading>
          <Text fontSize="lg" color="gray.600" _dark={{ color: 'gray.400' }}>
            Join Study Mate to organize your study schedule
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
              <FormControl id="name" isInvalid={!!errors.name}>
                <FormLabel>Full Name</FormLabel>
                <InputGroup>
                  <Input
                    type="text"
                    placeholder="John Doe"
                    leftElement={<Icon as={FiUser} color="gray.400" />}
                    {...register('name')}
                  />
                </InputGroup>
                <FormErrorMessage>
                  {errors.name && errors.name.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl id="email" isInvalid={!!errors.email}>
                <FormLabel>Email address</FormLabel>
                <InputGroup>
                  <Input
                    type="email"
                    placeholder="your@email.com"
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
                    placeholder="Create a password"
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

              <FormControl id="confirmPassword" isInvalid={!!errors.confirmPassword}>
                <FormLabel>Confirm Password</FormLabel>
                <InputGroup>
                  <Input
                    type={showConfirmPassword ? 'text' : 'password'}
                    placeholder="Confirm your password"
                    leftElement={<Icon as={FiLock} color="gray.400" />}
                    {...register('confirmPassword')}
                  />
                  <InputRightElement width="4.5rem">
                    <Button
                      h="1.75rem"
                      size="sm"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      variant="ghost"
                    >
                      {showConfirmPassword ? (
                        <FiEyeOff size={18} />
                      ) : (
                        <FiEye size={18} />
                      )}
                    </Button>
                  </InputRightElement>
                </InputGroup>
                <FormErrorMessage>
                  {errors.confirmPassword && errors.confirmPassword.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl id="academicLevel" isInvalid={!!errors.academicLevel}>
                <FormLabel>Academic Level</FormLabel>
                <Select
                  placeholder="Select your academic level"
                  leftElement={<Icon as={FiBook} color="gray.400" />}
                  {...register('academicLevel')}
                >
                  {academicLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>
                  {errors.academicLevel && errors.academicLevel.message}
                </FormErrorMessage>
              </FormControl>

              <FormControl id="institution">
                <FormLabel>Institution (Optional)</FormLabel>
                <Input
                  type="text"
                  placeholder="Your school or university"
                  {...register('institution')}
                />
              </FormControl>

              <Stack spacing={4} pt={2}>
                <Button
                  type="submit"
                  colorScheme="primary"
                  size="lg"
                  fontSize="md"
                  isLoading={isLoading}
                  loadingText="Creating account..."
                >
                  Create Account
                </Button>
                <Text align="center">
                  Already have an account?{' '}
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
            </Stack>
          </form>
        </Box>
      </Stack>
    </Flex>
  );
};

export default RegisterPage;
