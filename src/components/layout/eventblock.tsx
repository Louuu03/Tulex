// Event.tsx
import React from 'react';
import { Box, Flex, Text, Tag, HStack, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';

interface EventProps {
  category?: string;
  topic: string;
  level: string;
  language: string;
  streak?: string;
  date: string;
  statTag?: string;
  isSmall?: boolean;
  isSubscribed?: boolean;
  id: string | number;
  isSingle?: boolean;
  clickable?: boolean;
  isTag?: boolean;
}
const EventBlock: React.FC<EventProps> = ({
  category = '',
  topic,
  level,
  language = 'en',
  streak = '',
  date,
  statTag = '',
  isSmall = false,
  isSubscribed = false,
  id,
  isSingle = false,
  clickable = true,
  isTag = true,
}) => {
  const router = useRouter();

  return (
    <Flex
      className='eventblock'
      justify={'flex-start'}
      onClick={() => clickable && router.push(`/app/writing/event/${id}`)}
      cursor={isSingle ? 'default' : 'pointer'}
      mb={isSingle ? '0' : '20px'}
      width={isSingle ? '98%' : '300px'}
    >
      <VStack
        className='content-container'
        spacing={0}
        height={!isSmall ? '150px' : '100px'}
        minW={'260px'}
      >
        <Text
          fontWeight='bold'
          fontSize={!isSmall ? '20px' : '18px'}
          width={'100%'}
          textAlign={'left'}
        >
          {!isSmall ? category : topic}
        </Text>
        {!isSmall && (
          <Text
            className='topic-text'
            width={'100%'}
            textAlign={'left'}
            fontSize={'16px'}
          >
            {topic}
          </Text>
        )}
        <HStack justify={'space-between'} width={'100%'}>
          <Box className='left-container'>
            <Text>{level}</Text>
          </Box>
          <Box className='right-container' alignItems={'right'}>
            <Text textAlign={'right'}>{streak}</Text>
            <Text textAlign={'right'}>{`Ends on ${date}`}</Text>
          </Box>
        </HStack>
      </VStack>
      <Tag
        className='language-tag'
        size='sm'
        position='absolute'
        top='-1.5'
        right='20px'
      >
        {language}
      </Tag>
      {isTag && (!!statTag || isSubscribed) && (
        <Tag
          className='stat-tag'
          size='sm'
          position='absolute'
          bottom='-3'
          left='20px'
        >
          {!isSmall ? statTag : 'Subscribed'}
        </Tag>
      )}
    </Flex>
  );
};

export default EventBlock;
