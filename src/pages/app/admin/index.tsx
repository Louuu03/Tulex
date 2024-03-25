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
import React, { useState } from 'react';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState(false);
  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  return (
    <VStack align='center' className='login-container'>
      {/* <Image src="/tulex-logo.svg" alt="Tulex" width={150} height={150} /> */}
      <Heading as='h1' size='xl' textAlign='center' mt={100}>
        Tulex
      </Heading>
      <Text fontSize='lg' textAlign='center'>
        Admin
      </Text>
      <Box className='input-container'>
        <Text fontSize='lg' textAlign='center'>
          Account
        </Text>
        <Input />
        <Text fontSize='lg' textAlign='center'>
          Password
        </Text>
        <InputGroup>
          <Input type={showPassword ? 'text' : 'password'} />
          <InputRightElement>
            <IconButton
              className='toggle-password'
              aria-label={showPassword ? 'Hide password' : 'Show password'}
              icon={showPassword ? <VscEyeClosed /> : <VscEye />}
              onClick={handlePasswordVisibility}
              variant='ghost'
            />
          </InputRightElement>
        </InputGroup>
      </Box>
      <Button className='loginBtn' size='sm'>
        Log in
      </Button>
    </VStack>
  );
};

export default LoginPage;
