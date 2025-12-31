import React from "react";
import { Button as ChakraButton, ButtonProps, Spinner } from "@chakra-ui/react";

interface CustomButtonProps extends ButtonProps {
  loading?: boolean;
  loadingText?: string;
  leftIcon?: React.ReactElement;
  rightIcon?: React.ReactElement;
}

const Button: React.FC<CustomButtonProps> = ({
  children,
  loading = false,
  loadingText,
  leftIcon,
  rightIcon,
  disabled,
  ...rest
}) => {
  return (
    <ChakraButton
      colorScheme="blue"
      isLoading={loading}
      loadingText={loadingText}
      leftIcon={leftIcon}
      rightIcon={rightIcon}
      disabled={disabled || loading}
      _disabled={{
        opacity: 0.6,
        cursor: "not-allowed",
      }}
      _hover={{
        transform: "translateY(-1px)",
        boxShadow: "md",
      }}
      _active={{
        transform: "translateY(0)",
        boxShadow: "sm",
      }}
      {...rest}
    >
      {loading && !loadingText && <Spinner size="sm" mr={2} />}
      {children}
    </ChakraButton>
  );
};

export default Button;
