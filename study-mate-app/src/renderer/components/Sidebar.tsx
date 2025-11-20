import React from 'react';
import { Box, VStack, HStack, Text, Icon, useColorModeValue } from '@chakra-ui/react';
import { NavLink, useLocation } from 'react-router-dom';
import {
  FiHome,
  FiCalendar,
  FiBookOpen,
  FiClock,
  FiBarChart2,
  FiSettings,
  FiChevronRight,
} from 'react-icons/fi';

type NavItemProps = {
  icon: any;
  to: string;
  label: string;
  isActive: boolean;
};

const NavItem: React.FC<NavItemProps> = ({ icon, to, label, isActive }) => {
  const activeBg = useColorModeValue('primary.100', 'primary.900');
  const activeColor = useColorModeValue('primary.700', 'primary.200');
  const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.100');
  const textColor = useColorModeValue('gray.700', 'gray.200');

  return (
    <Box
      as={NavLink}
      to={to}
      w="full"
      px={4}
      py={3}
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderRadius="lg"
      bg={isActive ? activeBg : 'transparent'}
      color={isActive ? activeColor : textColor}
      _hover={{
        textDecoration: 'none',
        bg: isActive ? activeBg : hoverBg,
      }}
      transition="all 0.2s"
      fontWeight={isActive ? 'semibold' : 'normal'}
    >
      <HStack spacing={3}>
        <Icon as={icon} boxSize={5} />
        <Text fontSize="md">{label}</Text>
      </HStack>
      {isActive && <Icon as={FiChevronRight} boxSize={4} />}
    </Box>
  );
};

const Sidebar: React.FC = () => {
  const location = useLocation();
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const bgColor = useColorModeValue('white', 'gray.800');

  const navItems = [
    { icon: FiHome, label: 'Dashboard', path: '/dashboard' },
    { icon: FiCalendar, label: 'Schedule', path: '/schedule' },
    { icon: FiBookOpen, label: 'Units', path: '/units' },
    { icon: FiClock, label: 'Study Sessions', path: '/sessions' },
    { icon: FiBarChart2, label: 'Progress', path: '/progress' },
    { icon: FiSettings, label: 'Settings', path: '/settings' },
  ];

  return (
    <Box h="full" overflowY="auto" bg={bgColor} borderRight="1px" borderColor={borderColor}>
      <Box p={4}>
        <VStack spacing={1} align="stretch">
          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              to={item.path}
              label={item.label}
              isActive={location.pathname === item.path}
            />
          ))}
        </VStack>
      </Box>
    </Box>
  );
};

export default Sidebar;
