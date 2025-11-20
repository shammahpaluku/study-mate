// Custom theme configuration
const theme = {
  colors: {
    brand: {
      50: '#e6f7ff',
      100: '#b3e0ff',
      200: '#80c8ff',
      300: '#4db0ff',
      400: '#1a98ff',
      500: '#0080ff',
      600: '#0066cc',
      700: '#004d99',
      800: '#003366',
      900: '#001a33',
    },
  },
  fonts: {
    heading: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
    body: 'Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  styles: {
    global: {
      'html, body': {
        bg: 'white',
        color: 'gray.800',
        minHeight: '100vh',
      },
      '*, *::before, *::after': {
        boxSizing: 'border-box',
      },
      a: {
        color: 'brand.500',
        _hover: {
          textDecoration: 'underline',
        },
      },
    },
  },
};

export default theme;
