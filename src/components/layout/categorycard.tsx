import React from 'react';
import {
  Box,
  Image,
  Text,
  Stack,
  Button,
  useColorModeValue,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

type CardProps = {
  title: string;
  img: string;
  description: string;
  currentTopic: string;
  isSubscribed: boolean;
  onSubscribe: () => void;
  onSeeAllTopics: () => void;
};

const CategryCard: React.FC<CardProps> = ({
  title,
  img,
  description,
  currentTopic,
  isSubscribed,
  onSubscribe,
  onSeeAllTopics,
}) => {
  const router = useRouter();

  return (
    <VStack
      borderRadius='lg'
      display='flex'
      bg={useColorModeValue('white', 'gray.800')}
      className='category-card'
      width={'350px'}
      height={'190px'}
      border={'2px solid black'}
      m={'8px'}
      spacing={0}
    >
      <HStack
        className='content-container'
        borderTopRadius='lg'
        borderBottom={'1px solid black'}
        overflow={'hidden'}
        pr={'5px'}
        align={'flex-start'}
      >
        <Image
          src='/pictures/category.jpg'
          alt={`Image for ${title}`}
          w={'100px'}
          h={'100%'}
          objectFit='cover'
        />
        <Box flex='1' display='flex' flexDirection='column'>
          <Text
            fontSize='xl'
            fontWeight='semibold'
            lineHeight='short'
            pt={'5px'}
          >
            {title}
          </Text>
          <Text fontSize={'16px'}>{description}</Text>
          <Text color={'#E65D27'} fontSize='sm' mb={'5px'}>
            Latest: {currentTopic}
          </Text>
        </Box>
      </HStack>
      <HStack justify={'space-around'} width={'100%'} height={'35px'}>
        <Box
          p={'5px'}
          cursor={'pointer'}
          w={'50%'}
          textAlign={'center'}
          borderRight={'1px solid black'}
          boxSizing={'border-box'}
        >
          {isSubscribed ? 'unsubscribed' : 'Subscribe'}
        </Box>
        <Box
          p={'5px'}
          cursor={'pointer'}
          w={'50%'}
          textAlign={'center'}
          onClick={() => router.push('/app/writing/allevents/165344')}
        >
          See All Events
        </Box>
      </HStack>
    </VStack>
  );
};

export default CategryCard;
