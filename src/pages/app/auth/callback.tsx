import { useEffect } from 'react';
import { useRouter } from 'next/router';
import FullPageLoader from '../../../components/layout/fullloader';
import {
  getToken,
  resendVerificationCode,
  verifyEmail,
} from '@/utils/cognito-config';
import { useState } from 'react';
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  useToast,
} from '@chakra-ui/react';
import { isArray, isEmpty, isNumber } from 'lodash';
import axios from 'axios';
import jwt from 'jsonwebtoken';

const CallbackPage = () => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isVerifing, setIsVerifing] = useState<boolean>(false);
  const [verifyCode, setVerifyCode] = useState<string>('');
  const [canResend, setCanResend] = useState<boolean | number>(true);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [decodeData, setDecodeData] = useState<{ email: string; sub: string }|any>({
    email: '',
    sub: '',
  });
  const [allTokens, setAllTokens] = useState<{
    idToken: string;
    accessToken: string;
    refreshToken: string;
  }>({ idToken: '', accessToken: '', refreshToken: '' });

  const router = useRouter();
  const toast = useToast();

  const handleVerify = async () => {
    if (!isEmpty(verifyCode)) {
      setIsLoading(true);
      await verifyEmail(decodeData.email, verifyCode)
        .then(response => {
          toast({
            title: 'Verified',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          const { idToken, accessToken, refreshToken } = allTokens;
          setTokenToCookieAndContext(
            idToken,
            accessToken,
            refreshToken,
            decodeData.sub
          );
        })
        .catch(error => {
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
    resendVerificationCode(decodeData.email)
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

  const setTokenToCookieAndContext = async (
    idToken: string,
    accessToken: string,
    refreshToken: string,
    userId: string
  ) => {
    //set token in context
    setIsLoading(true);
    //set token in cookie
    axios
      .post('/api/auth/callback', {
        idToken,
        accessToken,
        refreshToken,
        userId,
      })
      .then(response => {
        response.status == 201
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
      });
  };

  //Get tokens and check if the email is verified
  useEffect(() => {
    setIsLoading(true);
    //Get the Token from the query string
    const url = router.asPath.split('?')[1];
    const params = new URLSearchParams(url);

    const code = params.get('code')?.split('#_=_')[0];
    if (!isEmpty(code)) {
      !isArray(code) &&
        code &&
        getToken(code)
          .then(({ id_token, access_token, refresh_token }) => {
            setAllTokens({
              idToken: id_token,
              accessToken: access_token,
              refreshToken: refresh_token,
            });
            const decoded:any = jwt.decode(id_token);
            setDecodeData(decoded);
            //If the email is verified
            if (decoded.email_verified) {
              setTokenToCookieAndContext(
                id_token,
                access_token,
                refresh_token,
                decoded.sub
              );
            } else {
              setIsVerifing(true);
              toast({
                title: 'Please verify your email',
                status: 'info',
                duration: 3000,
                isClosable: true,
              });
              setIsLoading(false);
            }
          })
          .catch(error => {
            setIsLoading(false);
            toast({
              title: error.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            router.push('/app/login');
          });
    } else {
      router.push('/app/login');
    }
  }, []);

  //For the countdown of the resend button
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
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      {isLoading && !isVerifing && <FullPageLoader />}
      <Modal
        isOpen={isVerifing && !isEmpty(decodeData.email)}
        onClose={() => setIsVerifing(false)}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Verify Email</ModalHeader>
          <ModalBody>
            <Text fontSize='md' textAlign='left'>
              {decodeData.email} <br />
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
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default CallbackPage;
