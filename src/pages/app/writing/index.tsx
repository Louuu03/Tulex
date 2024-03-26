import Slider from '@/components/layout/slider';
import {
  Box,
  Flex,
  Image,
  Skeleton,
  Text,
  VStack,
  useMediaQuery,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import FullPageLoader from '@/components/layout/fullloader';
import { DateTime } from 'luxon';
import { Article, Topic } from '@/utils/common-type';

const WritingPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{
    topics: Topic[] | any;
    articles: Article;
  } | null>(null);
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [hasPicLoaded, setHasPicLoaded] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('/api/writing')
      .then(response => {
        let newData = response.data;
        newData.topics.map(topic => {
          topic.endtime = DateTime.fromISO(topic.endtime)
            .toLocal()
            .toFormat('yyyy-MM-dd');
          return topic;
        });
        newData.articles.length > 0 &&
          newData.articles.map(article => {
            article.endtime = DateTime.fromISO(article.endtime)
              .toLocal()
              .toFormat('yyyy-MM-dd');
          });
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
    <VStack align='center' className='writing-container'>
      <VStack
        className={`main-container ${isLargerThan768 ? '' : 'phone'}`}
        marginLeft={isLargerThan768 ? '65px' : 'initial'}
        spacing={0}
      >
        <Box
          width={'100%'}
          height={'80px'}
          position={'relative'}
          lineHeight={'60px'}
          cursor={'pointer'}
          onClick={() => router.push('/app/writing/writingrules')}
          boxSizing='border-box'
          mt={'10px'}
        >
          <Skeleton
            isLoaded={hasPicLoaded}
            height={'80px'}
            fadeDuration={0.6}
            startColor='gray.100'
            endColor='gray.300'
          >
            <Image
              src='../../pictures/Lost.jpg'
              alt={`Image for `}
              width={'calc(100% - 40px)'}
              height={'80px'}
              objectFit='cover'
              borderRadius={'10px'}
              mx='20px'
              onLoad={() => setHasPicLoaded(true)}
              style={{ display: hasPicLoaded ? 'block' : 'none' }}
            />
            <Text
              fontSize={isLargerThan768 ? '40px' : '20px'}
              color='white'
              fontWeight={'700'}
              position={'absolute'}
              top={'10px'}
              left={'40px'}
              style={{ display: hasPicLoaded ? 'block' : 'none' }}
              zIndex={100}
            >
              {isLargerThan768 ? 'Feel Lost?' : "Don't know where to start?"}
            </Text>
            {isLargerThan768 && (
              <Text
                position={'absolute'}
                top={'14px'}
                left={'240px'}
                fontSize={'30px'}
                fontWeight={'700'}
                color={'white'}
                style={{ display: hasPicLoaded ? 'block' : 'none' }}
                zIndex={100}
              >
                Check how to start
              </Text>
            )}
          </Skeleton>
        </Box>
        <Flex wrap={'wrap'} width={'100%'} justify={'center'} mt={'20px'}>
          <Box
            className='guide-box'
            onClick={() => router.push('/app/writing/allcategories')}
          >
            Writing Categories
          </Box>
          <Box
            className='guide-box'
            onClick={() => router.push('/app/writing/popular')}
          >
            Popular
          </Box>
          <Box
            className='guide-box'
            onClick={() => router.push('/app/writing/allsubmissions')}
          >
            My Submission
          </Box>
          <Box
            className='guide-box'
            onClick={() => router.push('/app/writing/alldrafts')}
          >
            My Drafts
          </Box>
        </Flex>
        <Text className='title'>All Writing Topics</Text>
        <Slider events={data?.topics} link='/app/writing/popular' />;
        <Text className='title'>All Drafts</Text>
        <Slider events={data?.articles} link='/app/writing/alldrafts' />
      </VStack>
    </VStack>
  );
};

export default WritingPage;
