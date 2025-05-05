import { Skeleton, Stack } from '@chakra-ui/react';
import React from 'react';

const Chatloading = () => {
  return (
    <Stack spacing={3}>
      {Array(12).fill("").map((_, i) => (
        <Skeleton key={i} height="20px" />
      ))}
    </Stack>
  );
};

export default Chatloading;
