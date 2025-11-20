import React, { useState } from 'react';
import {
  Box,
  Flex,
  IconButton,
  useColorMode,
  useColorModeValue,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  MenuDivider,
  Text,
  HStack,
  useDisclosure,
  Icon,
  Tooltip,
} from '@chakra-ui/react';
import { FiSun, FiMoon, FiMenu, FiBell, FiUser, FiSettings, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import SettingsModal from './modals/SettingsModal';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useTheme();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');
  const iconColor = useColorModeValue('gray.600', 'gray.300');
  const hoverBg = useColorModeValue('gray.100', 'whiteAlpha.200');

  if (!user) return null;

  return (
    <>
      <Box
        as="header"
        position="sticky"
        top={0}
        zIndex={10}
        bg={bgColor}
        borderBottom="1px"
        borderColor={borderColor}
        px={4}
        py={3}
      >
        <Flex justify="space-between" align="center">
          {/* Left side */}
          <HStack spacing={4}>
            <IconButton
              display={{ base: 'inline-flex', md: 'none' }}
              aria-label="Open menu"
              icon={<FiMenu />}
              variant="ghost"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            />
            <Text fontSize="xl" fontWeight="bold">
              Study Mate
            </Text>
          </HStack>

          {/* Right side */}
          <HStack spacing={2}>
            <Tooltip label={colorMode === 'dark' ? 'Light mode' : 'Dark mode'}>
              <IconButton
                aria-label="Toggle color mode"
                icon={colorMode === 'dark' ? <FiSun /> : <FiMoon />}
                variant="ghost"
                onClick={toggleColorMode}
                color={iconColor}
                _hover={{ bg: hoverBg }}
              />
            </Tooltip>

            <Tooltip label="Notifications">
              <IconButton
                aria-label="Notifications"
                icon={<FiBell />}
                variant="ghost"
                color={iconColor}
                _hover={{ bg: hoverBg }}
                position="relative"
              >
                <Box
                  position="absolute"
                  top={2}
                  right={2}
                  w={2}
                  h={2}
                  bg="red.500"
                  borderRadius="full"
                />
              </IconButton>
            </Tooltip>

            <Menu>
              <MenuButton
                as={IconButton}
                rounded="full"
                variant="ghost"
                cursor="pointer"
                minW={0}
                _hover={{ bg: hoverBg }}
              >
                <Avatar
                  size="sm"
                  name={user.name || user.email}
                  src={user.avatar}
                  bg={useColorModeValue('primary.500', 'primary.400')}
                  color="white"
                />
              </MenuButton>
              <MenuList zIndex={20}>
                <MenuItem icon={<FiUser />} onClick={onOpen}>
                  Profile
                </MenuItem>
                <MenuItem icon={<FiSettings />} onClick={onOpen}>
                  Settings
                </MenuItem>
                <MenuDivider />
                <MenuItem icon={<FiLogOut />} onClick={logout} color="red.500">
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>

      {/* Mobile menu */}
      {showMobileMenu && (
        <Box
          display={{ md: 'none' }}
          bg={bgColor}
          borderBottom="1px"
          borderColor={borderColor}
          px={4}
          py={2}
        >
          {/* Mobile menu items would go here */}
        </Box>
      )}

      <SettingsModal isOpen={isOpen} onClose={onClose} />
    </>
  );
};

export default Header;
