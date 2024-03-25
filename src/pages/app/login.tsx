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
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useMediaQuery,
  HStack,
} from '@chakra-ui/react';
import React, { useState, useEffect } from 'react';
import { VscEye, VscEyeClosed } from 'react-icons/vsc';
import { isEmpty, isNumber } from 'lodash';
import {
  FacebookLogin,
  GoogleLogin,
  loginUser,
  resendVerificationCode,
  signUpUser,
  verifyEmail,
} from '@/utils/cognito-config';
import {
  FacebookLoginButton,
  GoogleLoginButton,
} from 'react-social-login-buttons';
import { useRouter } from 'next/router';
import jwt from 'jsonwebtoken';
import axios from 'axios';

const LoginPage: React.FC = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [isInvalid, setIsInvalid] = useState<{
    email: string;
    password: string;
  }>({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isVerifing, setIsVerifing] = useState<boolean>(false);
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [canResend, setCanResend] = useState<boolean | number>(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const toast = useToast();
  const router = useRouter();

  const handlePasswordVisibility = () => setShowPassword(!showPassword);

  const handleLogin = async () => {
    if (!(isEmpty(email) && isEmpty(password))) {
      //Lock the login button
      setIsLoading(true);
      //Login the user
      await loginUser(email, password)
        .then(response => {
          setIsLoading(false);
          //setTokens
          const {accessToken, refreshToken,idToken} = response;
          const decoded = jwt.decode(idToken.jwtToken);
          axios
          .post('/api/auth/callback', {
            idToken:idToken.jwtToken,
            accessToken:accessToken.jwtToken,
            refreshToken:refreshToken.token,
            userId:decoded?.sub,
          })
          .then(response => {
            return response.status == 201
              ? router.push('/app/guide')
              : router.push('/app');
          })
          .catch(error => {
            toast({
              title: error.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          })
        })
        .catch(error => {
          console.log(error);
          setIsLoading(false);
          toast({
            title: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
          //If the user is not verified, resend the verification code
          if (error.name == 'UserNotConfirmedException') {
            handleResend();
          }
        });
    } else {
      toast({
        title: 'Please fill in all fields',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleSignUp = async () => {
    if (!(isEmpty(email) && isEmpty(password))) {
      setIsLoading(true);
      await signUpUser(email, password)
        .then(response => {
          setIsLoading(false);
          toast({
            title: 'User created',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setIsVerifing(true);
        })
        .catch(error => {
          console.log(error.message);
          setIsLoading(false);
          toast({
            title: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        });
    } else {
      toast({
        title: 'Please fill in all fields',
        status: 'info',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const handleVerify = async () => {
    if (!isEmpty(verifyCode)) {
      setIsLoading(true);
      await verifyEmail(email, verifyCode)
        .then(response => {
          toast({
            title: 'Verified',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          handleLogin();
        })
        .catch(error => {
          console.log(error);
          setIsLoading(false);
          toast({
            title: error.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };
  const handleResend = async () => {
    setIsVerifing(true);
    resendVerificationCode(email)
      .then(response => {
        toast({
          title: 'Verification code sent',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(error => {
        setIsVerifing(false);
        toast({
          title: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const handleFacebookLogin = () => {
    setIsLoading(true);
    FacebookLogin();
  };
  const handleGoogleLogin = () => {
    setIsLoading(true);
    GoogleLogin();
  };

  useEffect(() => {
    !isEmpty(password) && !/^(?=.*[A-Z])(?=.*[0-9]).{8,}/.test(password)
      ? setIsInvalid({
          ...isInvalid,
          password:
            'Must contains 8 characters with at least 1 uppercase and 1 number',
        })
      : setIsInvalid({ ...isInvalid, password: '' });
  }, [password]);

  useEffect(() => {
    !isEmpty(email) && !/\S+@\S+\.\S+/.test(email)
      ? setIsInvalid({ ...isInvalid, email: 'Invalid email' })
      : setIsInvalid({ ...isInvalid, email: '' });
  }, [email]);

  useEffect(() => {
    isVerifing ? setCanResend(60) : setCanResend(false);
  }, [isVerifing]);

  useEffect(() => {
    if (isNumber(canResend) && canResend > 0) {
      // Clear previous timeout to avoid memory leaks or multiple countdowns
      if (timeoutId) clearTimeout(timeoutId);

      // Start a new countdown
      const id = setTimeout(() => {
        setCanResend(canResend - 1);
      }, 1000);
      setTimeoutId(id);
    } else if (isNumber(canResend) && canResend === 0) {
      setCanResend(true); // Enable resend when countdown reaches 0
    }
  }, [canResend]);
  useEffect(() => {
    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [timeoutId]);

  return (
    <VStack align='center' className='login-container'>
      {/* <Image src="/tulex-logo.svg" alt="Tulex" width={150} height={150} /> */}
      <HStack>
        <VStack minW={'300px'}>
          <Heading as='h1' size='xl' textAlign='center'>
            Tulex
          </Heading>
          <Text fontSize='lg' textAlign='center'>
            The Best Language Exchange App
          </Text>
          <Box className='input-container'>
            <Text fontSize='lg' textAlign='center'>
              Email
            </Text>
            <Input
              isInvalid={!!isInvalid.email}
              onBlur={e => setEmail(e.target.value)}
              mb={!isEmpty(isInvalid.email) ? '0' : '24px'}
              onChange={e => isInvalid.email && setEmail(e.target.value)}
            />
            <Text mt={0} color={'red'}>
              {isInvalid.email}
            </Text>
            <Text fontSize='lg' textAlign='center'>
              Password
            </Text>
            <InputGroup>
              <Input
                isInvalid={!!isInvalid.password}
                type={showPassword ? 'text' : 'password'}
                onBlur={e => setPassword(e.target.value)}
                onChange={e =>
                  isInvalid.password && setPassword(e.target.value)
                }
                mb={!isEmpty(isInvalid.password) ? '0' : '30px'}
              />
              <InputRightElement className='password-visibility'>
                <IconButton
                  className='toggle-password'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  icon={showPassword ? <VscEyeClosed /> : <VscEye />}
                  onClick={handlePasswordVisibility}
                  variant='ghost'
                />
              </InputRightElement>
            </InputGroup>
            <Text maxW='240px' fontSize={'10'} color={'red'}>
              {isInvalid.password}
            </Text>
          </Box>
          <Button
            className='loginBtn'
            onClick={handleLogin}
            isDisabled={!!isInvalid.email || !!isInvalid.password || isLoading}
          >
            Login
          </Button>
          <Button
            variant='outline'
            size='sm'
            onClick={handleSignUp}
            isDisabled={!!isInvalid.email || !!isInvalid.password || isLoading}
          >
            Sign up
          </Button>
          <Link textAlign='center' onClick={()=>{
            setEmail('tulex.guest0@gmail.com');
            setPassword('Abcd1234');
            handleLogin();
          }}>Log in as Guest</Link>
          {!isLargerThan768 && (
            <VStack minW={'300px'} padding={'20px'}>
              <FacebookLoginButton size='40px' onClick={handleFacebookLogin} />
              <GoogleLoginButton size='40px' onClick={handleGoogleLogin} />
            </VStack>
          )}
        </VStack>
        {isLargerThan768 && (
          <VStack minW={'50px'}>
            <Text fontWeight={'600'} fontSize={'20px'} textAlign={'center'}>
              OR
            </Text>
          </VStack>
        )}
        {isLargerThan768 && (
          <VStack minW={'300px'} padding={'20px'}>
            <FacebookLoginButton size='40px' onClick={handleFacebookLogin} />
            <GoogleLoginButton size='40px' onClick={handleGoogleLogin} />
          </VStack>
        )}
      </HStack>
      {/**MODAL FOR VERIFICATION CODE**/}
      <Modal
        isOpen={isVerifing}
        onClose={() => setIsVerifing(false)}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verify Email</ModalHeader>
          <ModalBody>
            <Text fontSize='md' textAlign='left'>
              {email} <br />
              Please check your email for a verification code.
            </Text>
            <Input onBlur={e => setVerifyCode(e.target.value)} />
          </ModalBody>
          <ModalFooter>
            <Button
              variant='ghost'
              isDisabled={isLoading || !canResend || isNumber(canResend)}
              mr={3}
              onClick={() => {
                handleResend();
                setCanResend(60);
              }}
              display={'flex'}
            >
              Resend{' '}
              {isNumber(canResend) && canResend > 0 && (
                <Text mt='6px' fontSize={'10'} ml='3px'>
                  {' '}
                  in {canResend} seconds
                </Text>
              )}
            </Button>
            <Button
              colorScheme='blue'
              isDisabled={isLoading}
              mr={3}
              onClick={() => handleVerify()}
            >
              Verify
            </Button>
            <Button
              variant='ghost'
              isDisabled={isLoading}
              onClick={() => setIsVerifing(false)}
            >
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default LoginPage;
