import React from 'react';
import { Box, Flex, useColorModeValue } from '@chakra-ui/react';
import { Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import Sidebar from './Sidebar';
import Header from './Header';
import LoadingSpinner from './common/LoadingSpinner';

const Layout: React.FC = () => {
  const { isAuthenticated, loading } = useAuth();
  const { colorMode } = useTheme();
  const bgColor = useColorModeValue('gray.50', 'gray.900');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  if (loading) {
    return (
      <Flex minH="100vh" align="center" justify="center">
        <LoadingSpinner size="xl" />
      </Flex>
    );
  }

  return (
    <Box minH="100vh" bg={bgColor}>
      {isAuthenticated ? (
        <Flex h="100vh" overflow="hidden">
          {/* Sidebar */}
          <Box
            as="aside"
            w="64"
            h="full"
            borderRight="1px"
            borderColor={borderColor}
            bg={useColorModeValue('white', 'gray.800')}
            display={{ base: 'none', md: 'block' }}
          >
            <Sidebar />
          </Box>

          {/* Main content */}
          <Box flex={1} overflowY="auto">
            <Header />
            <Box p={6}>
              <Outlet />
            </Box>
          </Box>
        </Flex>
      ) : (
        <Outlet />
      )}
    </Box>
  );
};

export default Layout;
