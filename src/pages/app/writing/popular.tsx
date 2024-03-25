import FiltersComponent from '@/components/layout/filter';
import { Center, Flex, Text, VStack, useMediaQuery } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import EventBlock from '@/components/layout/eventblock';
import FullPageLoader from '@/components/layout/fullloader';
import { DateTime } from 'luxon';
import axios from 'axios';
import { Topic } from '@/utils/common-type';

const PopularPage: NextPage = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<{
    topics: Topic[];
    userId: string;
  } | null>(null);
  const [originalData, setOriginalData] = useState<{
    topics: Topic[];
  } | null>(null);
  const colorSet = Math.floor(Math.random() * (10 - 2 + 1)) + 1;

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('/api/writing/popular')
      .then(response => {
        let newData = response.data;
        newData.topics.map(topic => {
          topic.endtime = DateTime.fromISO(topic.endtime)
            .toLocal()
            .toFormat('yyyy-MM-dd');
        });
        setOriginalData(newData);
        setData(newData);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
      });
  }, []);
  return isLoading ? (
    <FullPageLoader />
  ) : (
    data && (
      <VStack align='center' className='alldrafts-container'>
        <VStack className={`main-container ${isLargerThan768 ? '' : 'phone'}`}>
          <FiltersComponent
            type={'topic'}
            userId={data.userId}
            data={originalData.topics}
            setData={v => setData({ ...data, topics: v })}
            visibleFilters={['level', 'language']}
          />
          <Flex
            width={'100%'}
            wrap={'wrap'}
            justify={isLargerThan768 ? 'flex-start' : 'center'}
          >
            {data?.topics.length > 0 ? (
              data.topics.map((event, index) => (
                <EventBlock
                  key={'EventBlock' + index}
                  colorSet={colorSet}
                  id={index}
                  {...event}
                  isTag={false}
                />
              ))
            ) : (
              <Center w={'100%'} h={'250px'}>
                <Text fontSize={'20px'} color='gray'>
                  No popular topiocs found
                </Text>
              </Center>
            )}
          </Flex>
        </VStack>
      </VStack>
    )
  );
};

export default PopularPage;
