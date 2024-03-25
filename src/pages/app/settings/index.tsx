import {
  Box,
  Button,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  VStack,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { isEmpty, isString } from 'lodash';
import { useRouter } from 'next/router';
import React, { useState } from 'react';

const SettingPage: React.FC = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isOpen, setIsOpen] = useState<string | false>(false);
  const [suggestion, setSuggestion] = useState<string>();
  const router = useRouter();
  const toast = useToast();

  const onClose = () => setIsOpen(false);
  const onsubmit = (type: string) => () => {
    if (type === 'suggestion') {
      isEmpty(suggestion)
        ? toast({
            title: 'Please write something',
            status: 'error',
            duration: 3000,
            isClosable: true,
          })
        : axios
            .post('/api/settings/suggestion', { suggestion })
            .then(() => {
              setIsOpen(false);
              toast({
                title: 'Suggestion sent successfully',
                status: 'success',
                duration: 3000,
                isClosable: true,
              });
            })
            .catch(error => {
              toast({
                title: 'Failed to send suggestion',
                status: 'error',
                duration: 3000,
                isClosable: true,
              });
            });
    } else {
      setIsOpen(false);
      // TODO: Sign out
    }
  };

  return (
    <VStack align='center' className='setting-container'>
      <VStack
        className={`main-container ${isLargerThan768 ? '' : 'phone'}`}
        marginLeft={isLargerThan768 ? '65px' : 'initial'}
        spacing={0}
        pt='20px'
        fontSize={isLargerThan768 ? '28px' : '25px'}
        mt={'200px'}
        mb={0}
        overflowY={'hidden'}
        h={'400px'}
        boxSizing={'border-box'}
      >
        <Box
          cursor={'pointer'}
          className='setting-item'
          onClick={() => router.push('/app/settings/user')}
        >
          User
        </Box>
        {/* <Box className='setting-item' onClick={()=>{}}>General</Box> */}
        <Box
          cursor={'pointer'}
          className='setting-item'
          onClick={() => router.push('/app/settings/learninglanguages')}
        >
          Learning Languages
        </Box>
        <Box
          cursor={'pointer'}
          className='setting-item'
          onClick={() => {
            setIsOpen('suggestion');
          }}
        >
          Suggest Feature
        </Box>
        <Box
          cursor={'pointer'}
          className='setting-item'
          onClick={() => {
            setIsOpen('disconnection');
          }}
        >
          Sign out
        </Box>
      </VStack>
      <Modal isOpen={!!isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent w={'350px'}>
          <ModalHeader>
            {isOpen === 'suggestion' ? 'Suggest Feature' : 'Sign out'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {isOpen === 'suggestion' ? (
              <Textarea
                placeholder='Write something...'
                rows={6}
                onChange={e => setSuggestion(e.target.value)}
              />
            ) : (
              'Are you sure you want to sign out?'
            )}
          </ModalBody>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={()=>{isString(isOpen)&&onsubmit(isOpen)}}>
              {isOpen === 'suggestion' ? 'Send' : 'Yes'}
            </Button>
            <Button onClick={onClose}> Close </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default SettingPage;
