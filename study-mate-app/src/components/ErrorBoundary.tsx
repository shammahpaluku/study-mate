import React, { Component, ErrorInfo, ReactNode } from "react";
import { Box, Button, Text } from "@chakra-ui/react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: ErrorInfo;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  public render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <Box p={4}>
            <Box mb={4}>
              <Text fontSize="xl" fontWeight="bold">
                Something went wrong
              </Text>
            </Box>
            <Box mb={4}>
              <Text color="red.500">{this.state.error?.toString()}</Text>
            </Box>
            <Box>
              <Button
                colorScheme="blue"
                onClick={() => window.location.reload()}
                width="fit-content"
              >
                Reload Application
              </Button>
            </Box>
          </Box>
        )
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
