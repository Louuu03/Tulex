import React from 'react';
import { Spinner, Flex } from '@chakra-ui/react';

const FullPageLoader = () => {
  return (
    <Flex
      position='fixed' // Use "absolute" if you prefer
      top='0'
      left='0'
      right='0'
      bottom='0'
      justifyContent='center'
      alignItems='center'
      backgroundColor='rgba(255, 255, 255, 0.7)' // Semi-transparent background
      zIndex='9999' // Ensure it covers other content
    >
      <Spinner
        thickness='4px'
        speed='0.65s'
        emptyColor='gray.200'
        color='#cdaf43'
        size='xl'
      />
    </Flex>
  );
};

export default FullPageLoader;
