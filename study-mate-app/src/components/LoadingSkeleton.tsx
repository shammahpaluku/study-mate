import React from 'react';
import { Box, Skeleton } from '@chakra-ui/react';

interface LoadingSkeletonProps {
  count?: number;
  height?: string | number;
  width?: string | number;
  spacing?: number;
}

const LoadingSkeleton: React.FC<LoadingSkeletonProps> = ({
  count = 3,
  height = '20px',
  width = '100%',
  spacing = 4,
}) => {
  return (
    <Box>
      {[...Array(count)].map((_, i) => (
        <Box key={i} mb={i < count - 1 ? spacing : 0}>
          <Skeleton 
            height={height}
            width={width}
            borderRadius="md"
          />
        </Box>
      ))}
    </Box>
  );
};

export default LoadingSkeleton;
