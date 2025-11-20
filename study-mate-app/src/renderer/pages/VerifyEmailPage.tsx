import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Flex,
  Heading,
  Text,
  useColorModeValue,
  useToast,
  Icon,
  Link,
  VStack,
  Spinner,
} from '@chakra-ui/react';
import { FiCheckCircle, FiAlertCircle, FiMail } from 'react-icons/fi';
import { Link as RouterLink } from 'react-router-dom';

const VerifyEmailPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [isVerifying, setIsVerifying] = useState(true);
  const [isVerified, setIsVerified] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const token = searchParams.get('token');
  const navigate = useNavigate();
  const toast = useToast();
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const cardBg = useColorModeValue('white', 'gray.700');
  const borderColor = useColorModeValue('gray.200', 'gray.600');
  const errorColor = useColorModeValue('red.600', 'red.400');

  useEffect(() => {
    const verifyEmail = async () => {
      if (!token) {
        setError('Invalid verification link');
        setIsVerifying(false);
        return;
      }

      try {
        // TODO: Implement API call to verify email
        // await authService.verifyEmail(token);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));
        
        setIsVerified(true);
        toast({
          title: 'Email verified',
          description: 'Your email has been successfully verified!',
          status: 'success',
          duration: 5000,
          isClosable: true,
        });
      } catch (err) {
        console.error('Error verifying email:', err);
        setError('Failed to verify email. The link may have expired or is invalid.');
      } finally {
        setIsVerifying(false);
      }
    };

    verifyEmail();
  }, [token, toast]);

  if (isVerifying) {
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
            <Spinner size="xl" color="primary.500" />
            <Heading size="md">Verifying your email...</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.400' }}>
              Please wait while we verify your email address.
            </Text>
          </VStack>
        </Box>
      </Flex>
    );
  }

  if (error) {
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
              bg="red.100"
              color="red.500"
              w={16}
              h={16}
              rounded="full"
            >
              <Icon as={FiAlertCircle} boxSize={8} />
            </Box>
            <Heading size="lg">Verification Failed</Heading>
            <Text color={errorColor} fontWeight="medium">
              {error}
            </Text>
            <Text color="gray.600" _dark={{ color: 'gray.400' }}>
              Please request a new verification link or contact support if the problem persists.
            </Text>
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
            <Text>
              Need a new verification link?{' '}
              <Link
                as={RouterLink}
                to="/resend-verification"
                color="primary.500"
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
              >
                Resend email
              </Link>
            </Text>
          </VStack>
        </Box>
      </Flex>
    );
  }

  if (isVerified) {
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
            <Heading size="lg">Email Verified!</Heading>
            <Text color="gray.600" _dark={{ color: 'gray.400' }}>
              Thank you for verifying your email address. Your account is now active.
            </Text>
            <Button
              as={RouterLink}
              to="/login"
              colorScheme="primary"
              size="lg"
              width="full"
              mt={4}
            >
              Continue to Login
            </Button>
            <Text>
              Didn't receive the email?{' '}
              <Link
                as={RouterLink}
                to="/resend-verification"
                color="primary.500"
                fontWeight="medium"
                _hover={{ textDecoration: 'underline' }}
              >
                Resend email
              </Link>
            </Text>
          </VStack>
        </Box>
      </Flex>
    );
  }

  // Initial state (shouldn't be reached, but just in case)
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
            bg="blue.100"
            color="blue.500"
            w={16}
            h={16}
            rounded="full"
          >
            <Icon as={FiMail} boxSize={8} />
          </Box>
          <Heading size="lg">Verify Your Email</Heading>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            We've sent a verification link to your email address. Please check your inbox and click on the link to verify your account.
          </Text>
          <Text color="gray.600" _dark={{ color: 'gray.400' }}>
            If you don't see the email, please check your spam folder.
          </Text>
          <Button
            as={RouterLink}
            to="/login"
            colorScheme="primary"
            variant="outline"
            size="lg"
            width="full"
            mt={4}
          >
            Back to Login
          </Button>
          <Text>
            Didn't receive the email?{' '}
            <Link
              as={RouterLink}
              to="/resend-verification"
              color="primary.500"
              fontWeight="medium"
              _hover={{ textDecoration: 'underline' }}
            >
              Resend email
            </Link>
          </Text>
        </VStack>
      </Box>
    </Flex>
  );
};

export default VerifyEmailPage;
