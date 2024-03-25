import FiltersComponent from '@/components/layout/filter';
import { Center, Flex, Text, VStack, useMediaQuery } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import EventBlock from '@/components/layout/eventblock';
import { ObjectId } from 'mongodb';
import axios from 'axios';
import FullPageLoader from '@/components/layout/fullloader';
import { DateTime } from 'luxon';
import { Article } from '@/utils/common-type';

const AllSubmissionPage: NextPage = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<{
    articles: Article[];
    userId: string;
  } | null>(null);
  const [originalData, setOriginalData] = useState<{
    articles: Article[];
  } | null>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('/api/writing/allsubs')
      .then(response => {
        let newData = response.data;
        newData.articles.map(article => {
          console.log(article);
          article.endtime = DateTime.fromISO(article.endtime)
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
      <VStack align='center' className='allsubmission-container'>
        <VStack className={`main-container ${isLargerThan768 ? '' : 'phone'}`}>
          {/* <FiltersComponent visibleFilters={['level', 'language']} /> */}
          <FiltersComponent
            type={'topic'}
            userId={data.userId}
            data={originalData.articles}
            setData={v => setData({ ...data, articles: v })}
            visibleFilters={['level', 'language']}
          />
          <Flex
            width={'100%'}
            wrap={'wrap'}
            justify={isLargerThan768 ? 'flex-start' : 'center'}
          >
            {data?.articles.length > 0 ? (
              data.articles.map((event, index) => (
                <EventBlock
                  key={'EventBlock' + index}
                  {...event}
                  isTag={false}
                />
              ))
            ) : (
              <Center w={'100%'} h={'250px'}>
                <Text fontSize={'20px'} color='gray'>
                  No submission found
                </Text>
              </Center>
            )}
          </Flex>
        </VStack>
      </VStack>
    )
  );
};

export default AllSubmissionPage;
