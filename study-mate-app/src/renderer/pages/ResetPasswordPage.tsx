import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Input,
  InputGroup,
  InputRightElement,
  Stack,
  Text,
  useColorModeValue,
  useToast,
  Icon,
  Link,
} from '@chakra-ui/react';
import { FiLock, FiEye, FiEyeOff, FiCheckCircle } from 'react-icons/fi';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Link as RouterLink } from 'react-router-dom';

interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
}

const schema = yup.object().shape({
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
});

const ResetPasswordPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) {
      toast({
        title: 'Invalid token',
        description: 'The reset link is invalid or has expired.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      // TODO: Implement API call to reset password
      // await authService.resetPassword(token, data.password);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setIsSuccess(true);
      toast({
        title: 'Password updated',
        description: 'Your password has been successfully reset.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      console.error('Error resetting password:', error);
      toast({
        title: 'Error',
        description: 'Failed to reset password. The link may have expired or is invalid.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
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
              <Icon as={FiCheckCircle} boxSize={8} />
            </Box>
            <Heading as="h1" size="lg" mb={4}>
              Password Reset Successful
            </Heading>
            <Text color="gray.600" _dark={{ color: 'gray.400' }} mb={8}>
              Your password has been successfully updated. You can now sign in with your new password.
            </Text>
            <Button
              as={RouterLink}
              to="/login"
              colorScheme="primary"
              size="lg"
              width="full"
            >
              Back to login
            </Button>
          </Box>
        </Box>
      </Flex>
    );
  }

  if (!token) {
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
          <Heading as="h1" size="lg" mb={4}>
            Invalid Reset Link
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }} mb={6}>
            The password reset link is invalid or has expired. Please request a new link.
          </Text>
          <Button
            as={RouterLink}
            to="/forgot-password"
            colorScheme="primary"
            size="lg"
            width="full"
            mb={4}
          >
            Request New Link
          </Button>
          <Button
            as={RouterLink}
            to="/login"
            variant="outline"
            size="lg"
            width="full"
          >
            Back to Login
          </Button>
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
          <Heading as="h1" size="lg" mb={2}>
            Create New Password
          </Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            Create a new password for your account.
          </Text>
        </Box>

        <form onSubmit={handleSubmit(onSubmit)}>
          <Stack spacing={6}>
            <FormControl id="password" isInvalid={!!errors.password}>
              <FormLabel>New Password</FormLabel>
              <InputGroup>
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your new password"
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
              <Text color="red.500" mt={1} fontSize="sm">
                {errors.password?.message}
              </Text>
            </FormControl>

            <FormControl id="confirmPassword" isInvalid={!!errors.confirmPassword}>
              <FormLabel>Confirm New Password</FormLabel>
              <InputGroup>
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Confirm your new password"
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
              <Text color="red.500" mt={1} fontSize="sm">
                {errors.confirmPassword?.message}
              </Text>
            </FormControl>

            <Button
              type="submit"
              colorScheme="primary"
              size="lg"
              width="full"
              isLoading={isLoading}
              loadingText="Updating..."
              mt={4}
            >
              Reset Password
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

export default ResetPasswordPage;
