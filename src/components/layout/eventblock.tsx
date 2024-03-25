// Event.tsxcategory_name
import React, { use, useEffect } from 'react';
import { Box, Flex, Text, Tag, HStack, VStack } from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import en from '../../i18n/en.json';
import { find } from 'lodash';

interface EventProps {
  category_name?: string;
  name: string;
  level: number;
  language: string;
  streak?: string;
  endtime: string;
  statTag?: string;
  isSmall?: boolean;
  isSubscribed?: boolean;
  _id: string | number;
  isSingle?: boolean;
  clickable?: boolean;
  isTag?: boolean;
  topic_id?: string;
  id?: number;
  colorSet?: number;
}
const colors = [
  ['#355070', '#6d597a', '#b56576', '#e56b6f', '#e88c7d', '#eaac8b'],
  ['#797d62', '#9b9b7a', '#d9ae94', '#e4b074', '#d08c60', '#997b66'],
  ['#282828', '#404048', '#505860', '#381820', '#501820', '#502028'],
  ['#473335', '#b0413e', '#ce763b', '#e2af47', '#6bb4b1', '#32687a'],
  ['#bd6444', '#625e63', '#c78a50', '#cb9f5c', '#5c7373', '#5e656c'],
  ['#573d31', '#8b7469', '#d09a80', '#34211b', '#a4806b', '#5a3e30'],
  ['#c7c0a4', '#3f6964', '#914935', '#5d7174', '#e2bf83', '#5e8463'],
  ['#67688e', '#9395d3', '#1d376b', '#065a82', '#1c7293', '#9eb3c2'],
  ['#e5989b', '#6d6875', '#f2a69f', '#b5838d', '#cd8e94', '#917681'],
  ['#437f97', '#303036', '#849324', '#f68d0c', '#ec6608', '#5a622d'],
];

const EventBlock: React.FC<EventProps> = ({
  category_name = '',
  name,
  level = '0',
  language = 'en',
  streak = '',
  endtime,
  statTag = '',
  isSmall = false,
  isSubscribed = false,
  _id,
  isSingle = false,
  clickable = true,
  isTag = true,
  topic_id,
  id,
  colorSet,
}) => {
  const router = useRouter();
  const conlorNum = Math.floor(Math.random() * 5) + 1;
  const defaultColorSet = Math.floor(Math.random() * (colors.length - 2 + 1)) + 1;
  return (
    <Flex
      className='eventblock'
      justify={'flex-start'}
      onClick={() =>
        clickable && router.push(`/app/writing/topic/${topic_id || _id}`)
      }
      cursor={isSingle ? 'default' : 'pointer'}
      width={isSingle ? '420px' : '300px'}
    >
      <VStack
        className='content-container'
        spacing={0}
        height={!isSmall ? '150px' : '100px'}
        w={'100%'}
        minW={'260px'}
        boxShadow={'10px 5px 5px #b0b0b0'}
        bg={`${colors[colorSet||defaultColorSet][id ? (id > 5 ? id - 6 : id) : conlorNum]} !important`}
        color={'white'}
      >
        <Text
          fontWeight='bold'
          fontSize={!isSmall ? '20px' : '18px'}
          width={'100%'}
          textAlign={'left'}
        >
          {!isSmall ? category_name : name}
        </Text>
        {!isSmall && (
          <Text
            className='topic-text'
            width={'100%'}
            textAlign={'left'}
            fontSize={'16px'}
          >
            {name}
          </Text>
        )}
        <HStack justify={'space-between'} width={'100%'}>
          <Box className='left-container'>
            <Text>{en.Level[level].name}</Text>
          </Box>
          <Box className='right-container' alignItems={'right'}>
            <Text textAlign={'right'}>{streak}</Text>
            <Text
              textAlign={'right'}
            >{`Ends on ${endtime.replace(/-/g, '/')}`}</Text>
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
        {find(en.abbLang, { value: language })?.name}
      </Tag>
      {isTag && (!!statTag || isSubscribed) && (
        <Tag
          className='stat-tag'
          size='sm'
          position='absolute'
          bottom='-3'
          left='20px'
          mb='5px'
        >
          {!isSmall ? statTag : 'Subscribed'}
        </Tag>
      )}
    </Flex>
  );
};

export default React.memo(EventBlock);

