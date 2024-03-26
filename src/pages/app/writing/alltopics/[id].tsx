import FiltersComponent from '@/components/layout/filter';
import {
  Box,
  Center,
  Flex,
  Text,
  VStack,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import EventBlock from '@/components/layout/eventblock';
import axios from 'axios';
import FullPageLoader from '@/components/layout/fullloader';
import { DateTime } from 'luxon';
import { Category, Topic } from '@/utils/common-type';

interface CategoryId {
  id: string;
}
interface AllEventsPageProps {
  categoryId: CategoryId;
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.params!;

  const categoryId = { id };
  return {
    props: { categoryId },
  };
};

const AllEventsPage: NextPage<AllEventsPageProps> = ({ categoryId }) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [originalData, setOriginalData] = useState<{
    topics: Topic[] | null;
  } | null>(null);
  const [data, setData] = useState<{
    topics: Topic[] | any;
    category: Category;
    userId: string;
  } | null>(null);

  const toast = useToast();

  useEffect(() => {
    setIsLoading(true);
    axios
      .get('/api/writing/alltopics?category_id=' + categoryId.id)
      .then(response => {
        let newData = response.data;
        newData.topics.forEach(topic => {
          topic.create_time = DateTime.fromISO(topic.create_time)
            .toLocal()
            .toFormat('yyyy-MM-dd');
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
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, [categoryId]);
  return isLoading ? (
    <FullPageLoader />
  ) : (
    originalData && data && data.category && (
      <VStack align='center' className='allevents-container'>
        <VStack className={`main-container ${isLargerThan768 ? '' : 'phone'}`}>
          <Box
            width={'100%'}
            textAlign={'left'}
            px={isLargerThan768 ? '0' : '20px'}
          >
            <Text
              display={'inline'}
              fontSize={'25px'}
              fontWeight={'700'}
              color='#cdaf43'
              mr='-5px'
            >
              {data?.category?.name}
            </Text>
            <Text display={'inline'} p={'0 30px'} textAlign={'justify'}>
              {data?.category?.long}
            </Text>
          </Box>
          <FiltersComponent
            type={'topic'}
            userId={data.userId}
            data={originalData.topics}
            setData={v => setData({ ...data, topics: v })}
            visibleFilters={['subscription', 'status', 'level', 'language']}
          />
          <Flex
            width={'100%'}
            wrap={'wrap'}
            justify={isLargerThan768 ? 'flex-start' : 'center'}
          >
            {data?.topics?.map((topic, index) => (
              <EventBlock key={'EventBlock' + index} {...topic} />
            ))}
            {data?.topics.length === 0 && (
              <Center w={'100%'} h={'250px'}>
                <Text fontSize={'20px'} color='gray'>
                  No topics found
                </Text>
              </Center>
            )}
          </Flex>
        </VStack>
      </VStack>
    )
  );
};

export default AllEventsPage;
