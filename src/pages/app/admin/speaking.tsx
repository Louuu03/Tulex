// pages/login.tsx
import {
  Button,
  Input,
  VStack,
  Heading,
  Text,
  Link,
  Box,
  InputGroup,
  InputRightElement,
  IconButton,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const LoginPage: React.FC = () => {
  const router = useRouter();

  return (
    <VStack align='center' className='login-container'>
      <Button mt={5} onClick={() => router.push('/app/admin/writing')}>
        To Writing
      </Button>
      <Text pt='300px' fontSize='lg' textAlign='center'>
        Coming Soon
      </Text>
    </VStack>
  );
};

export default LoginPage;
