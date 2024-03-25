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
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import FullPageLoader from '@/components/layout/fullloader';
import { DateTime } from 'luxon';
import { Topic } from '@/utils/common-type';

const HomePage: React.FC = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLoading, setIsLoading] = useState(true);
  const [hasPicNewLoaded, setHasPicNewLoaded] = useState(false);
  const [hasPicHotLoaded, setHasPicHotLoaded] = useState(false);
  const [data, setData] = useState<{
    topics: Topic[];
    hotTopic: Topic[] | null;
  } | null>(null);
  const router = useRouter();

  const getData = async () => {
    !data
      ? axios
          .get('/api/app')
          .then(response => {
            let newData = response.data;
            newData.topics.map(topic => {
              topic.endtime = DateTime.fromISO(topic.endtime)
                .toLocal()
                .toFormat('yyyy-MM-dd');
            });
            setData(newData);

            setIsLoading(false);
          })
          .catch(error => {
            setIsLoading(false);
          })
      : setIsLoading(false);
  };

  // Call fetchAndSetUser when the component mounts
  useEffect(() => {
    setIsLoading(true);
    getData();
  }, []);
  return isLoading ? (
    <FullPageLoader />
  ) : (
    <VStack align='center' className='home-container'>
      <VStack
        className={`main-container ${isLargerThan768 ? '' : 'phone'}`}
        marginLeft={isLargerThan768 ? '65px' : 'initial'}
        spacing={0}
      >
        <VStack px={'26px'} w={'100%'} my='20px'>
          <Box
            width={'100%'}
            height={'80px'}
            position={'relative'}
            lineHeight={'60px'}
            cursor={'pointer'}
            onClick={() => router.push('/app/news')}
          >
            <Skeleton
              isLoaded={hasPicNewLoaded}
              fadeDuration={0.6}
              startColor='gray.100'
              endColor='gray.300'
            >
              <Image
                src='/pictures/New.jpg'
                alt={`Image for `}
                width={'100%'}
                height={'80px'}
                objectFit='cover'
                borderRadius={'10px'}
                onLoad={() => setHasPicNewLoaded(true)}
                style={{ display: hasPicNewLoaded ? 'block' : 'none' }}
              />
              <Text
                fontSize={'40px'}
                fontWeight={'700'}
                position={'absolute'}
                top={'10px'}
                left={'20px'}
                zIndex={100}
                style={{ display: hasPicNewLoaded ? 'block' : 'none' }}
              >
                What's new
              </Text>
            </Skeleton>
          </Box>
          <Box
            mt='5px'
            width={'100%'}
            height={'80px'}
            position={'relative'}
            lineHeight={'60px'}
            cursor={'pointer'}
            onClick={() =>
              router.push('/app/writing/topic/' + data?.hotTopic?._id)
            }
          >
            <Skeleton
              isLoaded={hasPicHotLoaded}
              fadeDuration={0.6}
              startColor='gray.100'
              endColor='gray.300'
            >
              <Image
                className='popular-image'
                src='/pictures/Popular.jpg'
                alt={`Image for `}
                width={'100%'}
                height={'80px'}
                objectFit='cover'
                borderRadius={'10px'}
                filter={'grayscale(50%)'}
                onLoad={() => setHasPicHotLoaded(true)}
                style={{ display: hasPicHotLoaded ? 'block' : 'none' }}
              />
              <Text
                fontSize={'40px'}
                color='white'
                fontWeight={'700'}
                position={'absolute'}
                top={'10px'}
                left={'20px'}
                zIndex={100}
                style={{ display: hasPicHotLoaded ? 'block' : 'none' }}
              >
                Hot Topic{isLargerThan768 ? ':' : ''}
              </Text>
              <Text
                position={'absolute'}
                top={'14px'}
                left={'240px'}
                fontSize={'30px'}
                fontWeight={'700'}
                color={'white'}
                zIndex={100}
                style={{ display: hasPicHotLoaded ? 'block' : 'none' }}
              >
                {isLargerThan768 ? data?.hotTopic?.name : ''}
              </Text>
            </Skeleton>
          </Box>
        </VStack>
        <Flex
          wrap={'wrap'}
          width={'100%'}
          justify={'center'}
          my='20px'
          mt={isLargerThan768 ? '20px' : '10px'}
        >
          <Box
            className='guide-box'
            onClick={() => router.push('/app/writing/allcategories')}
          >
            All Categories
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
            My submissions
          </Box>
          <Box
            className='guide-box'
            onClick={() => router.push('/app/writing/alldrafts')}
          >
            My Drafts
          </Box>
        </Flex>
        <Text className='title'>All Ongoing Writing Topics</Text>
        <Slider events={data?.topics} link='/app/writing/popular' />;
      </VStack>
    </VStack>
  );
};

export default HomePage;
