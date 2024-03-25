import React from 'react';
import {
  Box,
  Image,
  Text,
  useColorModeValue,
  VStack,
  HStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { isEmpty } from 'lodash';

type CardProps = {
  category_id: string;
  title: string;
  img: string;
  description: string;
  currentTopic: string | false;
  isSubscribed: boolean;
  isLoading: boolean | string;
  onSubscribe: (category_id: string) => void;
};

const CategryCard: React.FC<CardProps> = ({
  category_id,
  title,
  img,
  description,
  currentTopic,
  isSubscribed,
  isLoading,
  onSubscribe,
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
          src={isEmpty(img) ? '/pictures/category.jpg' : img}
          alt={`Image for ${title}`}
          w={'100px'}
          h={'100%'}
          objectFit='cover'
        />
        <Box flex='1' display='flex' flexDirection='column' minW={'235px'}>
          <Text
            fontSize='xl'
            fontWeight='semibold'
            lineHeight='short'
            pt={'5px'}
          >
            {title}
          </Text>
          <Text fontSize={'16px'}>{description}</Text>
          {currentTopic && (
            <Text color={'#E65D27'} fontSize='sm' mb={'5px'}>
              Latest: {currentTopic}
            </Text>
          )}
        </Box>
      </HStack>
      <HStack justify={'space-around'} width={'100%'} height={'35px'}>
        <Box
          p={'5px'}
          cursor={isLoading ? 'loading' : 'pointer'}
          w={'50%'}
          textAlign={'center'}
          borderRight={'1px solid black'}
          boxSizing={'border-box'}
          onClick={() => !isLoading && onSubscribe(category_id)}
        >
          {!!isLoading && isLoading == category_id
            ? 'Loading'
            : isSubscribed
              ? 'unsubscribed'
              : 'Subscribe'}
        </Box>
        <Box
          p={'5px'}
          cursor={'pointer'}
          w={'50%'}
          textAlign={'center'}
          onClick={() => router.push('/app/writing/alltopics/' + category_id)}
        >
          See All Topics
        </Box>
      </HStack>
    </VStack>
  );
};

export default CategryCard;
