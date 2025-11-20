import { extendTheme, type ThemeConfig } from '@chakra-ui/react';

// Color mode configuration
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: true,
};

// Color palette
const colors = {
  brand: {
    50: '#e6f7ff',
    100: '#b3e0ff',
    200: '#80caff',
    300: '#4db3ff',
    400: '#1a9cff',
    500: '#0080ff',
    600: '#0066cc',
    700: '#004d99',
    800: '#003366',
    900: '#001a33',
  },
  primary: {
    50: '#f0f9ff',
    100: '#e0f2fe',
    200: '#bae6fd',
    300: '#7dd3fc',
    400: '#38bdf8',
    500: '#0ea5e9',
    600: '#0284c7',
    700: '#0369a1',
    800: '#075985',
    900: '#0c4a6e',
  },
  success: {
    50: '#f0fdf4',
    500: '#10b981',
    700: '#047857',
  },
  warning: {
    50: '#fffbeb',
    500: '#f59e0b',
    700: '#b45309',
  },
  error: {
    50: '#fef2f2',
    500: '#ef4444',
    700: '#b91c1c',
  },
};

// Custom components
const components = {
  Button: {
    baseStyle: {
      fontWeight: 'medium',
      borderRadius: 'lg',
      _focus: {
        boxShadow: 'none',
      },
    },
    variants: {
      solid: (props: any) => ({
        bg: `${props.colorScheme}.500`,
        color: 'white',
        _hover: {
          bg: `${props.colorScheme}.600`,
          _disabled: {
            bg: `${props.colorScheme}.500`,
          },
        },
        _active: {
          bg: `${props.colorScheme}.700`,
        },
      }),
      outline: (props: any) => ({
        border: '1px solid',
        borderColor: `${props.colorScheme}.500`,
        color: `${props.colorScheme}.500`,
        _hover: {
          bg: `${props.colorScheme}.50`,
          _dark: {
            bg: 'whiteAlpha.100',
          },
        },
      }),
      ghost: (props: any) => ({
        color: `${props.colorScheme}.500`,
        _hover: {
          bg: `${props.colorScheme}.50`,
          _dark: {
            bg: 'whiteAlpha.100',
          },
        },
      }),
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: 'primary.500',
    },
  },
  Textarea: {
    defaultProps: {
      focusBorderColor: 'primary.500',
    },
  },
  Select: {
    defaultProps: {
      focusBorderColor: 'primary.500',
    },
  },
};

// Global styles
const styles = {
  global: (props: any) => ({
    body: {
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
    },
    '::-webkit-scrollbar': {
      width: '8px',
      height: '8px',
    },
    '::-webkit-scrollbar-track': {
      bg: props.colorMode === 'dark' ? 'gray.800' : 'gray.100',
    },
    '::-webkit-scrollbar-thumb': {
      bg: props.colorMode === 'dark' ? 'gray.600' : 'gray.300',
      borderRadius: 'full',
      '&:hover': {
        bg: props.colorMode === 'dark' ? 'gray.500' : 'gray.400',
      },
    },
  }),
};

// Extend the theme
const theme = extendTheme({
  config,
  colors,
  components,
  styles,
  fonts: {
    heading: 'Inter, -apple-system, sans-serif',
    body: 'Inter, -apple-system, sans-serif',
  },
  shadows: {
    outline: '0 0 0 3px var(--chakra-colors-primary-500)',
  },
});

export default theme;
