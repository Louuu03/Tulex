import Slider from '@/components/layout/slider';
import { Box, Flex, Text, VStack, useMediaQuery } from '@chakra-ui/react';
import React from 'react';
import fakedata from '@/utils/fakedata';
import { useRouter } from 'next/router';

const HomePage: React.FC = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const router = useRouter();

  return (
    <VStack align='center' className='home-container'>
      <VStack
        className={`main-container ${isLargerThan768 ? '' : 'phone'}`}
        marginLeft={isLargerThan768 ? '65px' : 'initial'}
        spacing={0}
      >
        <Flex wrap={'wrap'} width={'100%'} justify={'center'}>
          <Box
            className='guide-box'
            bg={'linear-gradient(to right, #007991, #78ffd6)'}
            onClick={() => router.push('/app/writing/allcategories')}
          >
            All Categories
          </Box>
          <Box
            className='guide-box'
            bg={'linear-gradient(to right, #f0f2f0, #000c40)'}
            onClick={() => router.push('/app/writing/popular')}
          >
            Popular
          </Box>
          <Box
            className='guide-box'
            bg={'linear-gradient(to right, #000000, #e74c3c)'}
            onClick={() => router.push('/app/writing/allsubmissions')}
          >
            My submissions
          </Box>
          <Box
            className='guide-box'
            bg={'linear-gradient(to right, #dbe6f6, #c5796d)'}
            onClick={() => router.push('/app/writing/alldrafts')}
          >
            My Drafts
          </Box>
        </Flex>
        <Text className='title'>All Events</Text>
        <Slider events={fakedata.eventsData} />;
        <Text className='title'>Subscribed Events</Text>
        <Slider events={fakedata.eventsData} />;
      </VStack>
    </VStack>
  );
};

export default HomePage;
