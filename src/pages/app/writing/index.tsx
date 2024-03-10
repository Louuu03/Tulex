import Slider from '@/components/layout/slider';
import { Box, Flex, Text, VStack, useMediaQuery } from '@chakra-ui/react';
import { useRouter } from 'next/router';
import React from 'react';
import fakedata from '@/utils/fakedata';

const WritingPage: React.FC = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const router = useRouter();

  return (
    <VStack align='center' className='writing-container'>
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
            Writing Categories
          </Box>
          <Box
            className='guide-box'
            bg={'linear-gradient(to right, #f0f2f0, #000c40)'}
            onClick={() => router.push('/app/writing/popular')}
          >
            My Writing Categories
          </Box>
          <Box
            className='guide-box'
            bg={'linear-gradient(to right, #000000, #e74c3c)'}
            onClick={() => router.push('/app/writing/allsubmissions')}
          >
            My Writing Topics
          </Box>
          <Box
            className='guide-box'
            bg={'linear-gradient(to right, #dbe6f6, #c5796d)'}
            onClick={() => router.push('/app/writing/alldrafts')}
          >
            My Submissions
          </Box>
        </Flex>
        <Text className='title'>All Writing Topics</Text>
        <Slider events={fakedata.eventsData} />;
        <Text className='title'>All Drafts</Text>
        <Slider events={fakedata.eventsData} />;
      </VStack>
    </VStack>
  );
};

export default WritingPage;
