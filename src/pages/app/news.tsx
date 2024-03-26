import FullPageLoader from '@/components/layout/fullloader';
import { Text, VStack, useMediaQuery, useToast } from '@chakra-ui/react';
import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ObjectId } from 'mongodb';
import { DateTime } from 'luxon';
import { News } from '@/utils/common-type';

interface DataType {
  news: News;
}
const NewsPage: React.FC = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [data, setData] = useState<DataType | null>(null);
  const toast = useToast();
  useEffect(() => {
    setIsLoading(true);
    axios
      .get('/api/news')
      .then(res => {
        setData(res.data);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        toast({
          title: 'An unexpected error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, []);

  return isLoading ? (
    <FullPageLoader />
  ) : (
    data?.news && (
      <VStack align='center' className='news-container'>
        <VStack
          className={`main-container ${isLargerThan768 ? '' : 'phone'}`}
          marginLeft={isLargerThan768 ? '65px' : 'initial'}
          spacing={0}
          px={isLargerThan768 ? '26px' : '28px'}
          pl={isLargerThan768 ? '26px' : '28px !important'}
          align={'flex-start'}
        >
          <Text
            maxW='600px'
            mt={'20px'}
            fontSize={'5xl'}
            fontWeight={'700'}
            color={'#cdaf43'}
            lineHeight={'45px'}
          >
            {data?.news.title}
          </Text>
          <Text maxW='600px' fontSize={'16px'} mt={'10px'}>
            {data?.news.author}
          </Text>
          <Text maxW='600px' fontSize={'16px'} mb={'20px'}>
            {DateTime.fromISO(data.news.time).toLocal().toFormat('yyyy/MM/dd')}
          </Text>
          {data?.news.content.map((paragraph, index) => (
            <Text maxW='1200px' key={index} mt={'10px'}>
              {paragraph}
            </Text>
          ))}
        </VStack>
      </VStack>
    )
  );
};

export default NewsPage;
