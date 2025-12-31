import { extendTheme, type ThemeConfig } from "@chakra-ui/react";

// Color mode configuration
const config: ThemeConfig = {
  initialColorMode: "light",
  useSystemColorMode: true,
};

// Enhanced color palette
const colors = {
  brand: {
    50: "#e6f7ff",
    100: "#b3e0ff",
    200: "#80caff",
    300: "#4db3ff",
    400: "#1a9cff",
    500: "#0080ff",
    600: "#0066cc",
    700: "#004d99",
    800: "#003366",
    900: "#001a33",
  },
  primary: {
    50: "#f0f9ff",
    100: "#e0f2fe",
    200: "#bae6fd",
    300: "#7dd3fc",
    400: "#38bdf8",
    500: "#0ea5e9",
    600: "#0284c7",
    700: "#0369a1",
    800: "#075985",
    900: "#0c4a6e",
  },
  accent: {
    50: "#fdf4ff",
    100: "#fae8ff",
    200: "#f5d0fe",
    300: "#f0abfc",
    400: "#e879f9",
    500: "#d946ef",
    600: "#c026d3",
    700: "#a21caf",
    800: "#86198f",
    900: "#701a75",
  },
  success: {
    50: "#f0fdf4",
    500: "#10b981",
    700: "#047857",
  },
  warning: {
    50: "#fffbeb",
    500: "#f59e0b",
    700: "#b45309",
  },
  error: {
    50: "#fef2f2",
    500: "#ef4444",
    700: "#b91c1c",
  },
};

// Enhanced custom components
const components = {
  Button: {
    baseStyle: {
      fontWeight: "600",
      borderRadius: "lg",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      _focus: {
        boxShadow: "none",
      },
    },
    variants: {
      solid: (props: any) => ({
        bg: `${props.colorScheme}.500`,
        color: "white",
        _hover: {
          bg: `${props.colorScheme}.600`,
          transform: "translateY(-1px)",
          boxShadow: "md",
          _disabled: {
            bg: `${props.colorScheme}.500`,
            transform: "none",
            boxShadow: "none",
          },
        },
        _active: {
          bg: `${props.colorScheme}.700`,
          transform: "translateY(0)",
        },
      }),
      outline: (props: any) => ({
        border: "2px solid",
        borderColor: `${props.colorScheme}.500`,
        color: `${props.colorScheme}.500`,
        _hover: {
          bg: `${props.colorScheme}.50`,
          borderColor: `${props.colorScheme}.600`,
          transform: "translateY(-1px)",
          boxShadow: "sm",
          _dark: {
            bg: "whiteAlpha.100",
          },
        },
      }),
      ghost: (props: any) => ({
        color: `${props.colorScheme}.500`,
        _hover: {
          bg: `${props.colorScheme}.50`,
          transform: "translateY(-1px)",
          _dark: {
            bg: "whiteAlpha.100",
          },
        },
      }),
    },
  },
  Card: {
    baseStyle: {
      borderRadius: "xl",
      boxShadow: "sm",
      transition: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
      _hover: {
        boxShadow: "md",
        transform: "translateY(-2px)",
      },
    },
  },
  Heading: {
    baseStyle: {
      fontWeight: "700",
      letterSpacing: "-0.025em",
    },
  },
  Input: {
    defaultProps: {
      focusBorderColor: "primary.500",
    },
    baseStyle: {
      borderRadius: "lg",
      transition: "all 0.2s ease-in-out",
      _focus: {
        boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
      },
    },
  },
  Textarea: {
    defaultProps: {
      focusBorderColor: "primary.500",
    },
    baseStyle: {
      borderRadius: "lg",
      transition: "all 0.2s ease-in-out",
      _focus: {
        boxShadow: "0 0 0 3px rgba(14, 165, 233, 0.1)",
      },
    },
  },
  Select: {
    defaultProps: {
      focusBorderColor: "primary.500",
    },
  },
  Progress: {
    baseStyle: {
      borderRadius: "full",
    },
  },
  Badge: {
    baseStyle: {
      fontWeight: "600",
      borderRadius: "md",
    },
  },
};

// Enhanced global styles
const styles = {
  global: (props: any) => ({
    body: {
      fontFeatureSettings: '"cv02", "cv03", "cv04", "cv11"',
      bg: props.colorMode === "dark" ? "gray.900" : "gray.50",
      color: props.colorMode === "dark" ? "gray.100" : "gray.800",
    },
    "::-webkit-scrollbar": {
      width: "10px",
      height: "10px",
    },
    "::-webkit-scrollbar-track": {
      bg: props.colorMode === "dark" ? "gray.800" : "gray.100",
      borderRadius: "full",
    },
    "::-webkit-scrollbar-thumb": {
      bg: props.colorMode === "dark" ? "gray.600" : "gray.300",
      borderRadius: "full",
      "&:hover": {
        bg: props.colorMode === "dark" ? "gray.500" : "gray.400",
      },
    },
    "*": {
      transition:
        "background-color 0.2s ease-in-out, border-color 0.2s ease-in-out",
    },
  }),
};

// Enhanced shadows
const shadows = {
  outline: "0 0 0 3px var(--chakra-colors-primary-500)",
  soft: "0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)",
  medium:
    "0 4px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  strong:
    "0 10px 40px -10px rgba(0, 0, 0, 0.15), 0 4px 25px -5px rgba(0, 0, 0, 0.1)",
  glow: "0 0 20px rgba(14, 165, 233, 0.3)",
};

// Extend the theme
const theme = extendTheme({
  config,
  colors,
  components,
  styles,
  fonts: {
    heading: "Inter, -apple-system, sans-serif",
    body: "Inter, -apple-system, sans-serif",
  },
  shadows,
  space: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
});

export default theme;
