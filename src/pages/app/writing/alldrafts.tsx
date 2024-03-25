import FiltersComponent from '@/components/layout/filter';
import { Center, Flex, Text, VStack, useMediaQuery } from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { NextPage } from 'next';
import EventBlock from '@/components/layout/eventblock';
import axios from 'axios';
import FullPageLoader from '@/components/layout/fullloader';
import { DateTime } from 'luxon';
import { Article } from '@/utils/common-type';


const AllDraftsPage: NextPage = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<{
    articles: Article[] | any;
    userId: string;
  } | null>(null);
  const [originalData, setOriginalData] = useState<{
    articles: Article[];
  }|null>(null);

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('/api/writing/alldrafts')
      .then(response => {
        let newData = response.data;
        newData.articles.forEach(article => {
          article.endtime = DateTime.fromISO(article.endtime)
            .toLocal()
            .toFormat('yyyy-MM-dd');
        });
        setData(newData);
        setOriginalData(newData);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
      });
  }, []);
  return isLoading ? (
    <FullPageLoader />
  ) : (data&& originalData &&
    <VStack align='center' className='alldrafts-container'>
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
              <EventBlock key={'EventBlock' + index} {...event} isTag={false} />
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
  );
};

export default AllDraftsPage;
