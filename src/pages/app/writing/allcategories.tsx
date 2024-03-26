import CategoryCard from '@/components/layout/categorycard';
import FiltersComponent from '@/components/layout/filter';
import { Flex, VStack, useMediaQuery, useToast } from '@chakra-ui/react';
import axios from 'axios';
import FullPageLoader from '@/components/layout/fullloader';
import React, { useEffect, useState } from 'react';
import { cloneDeep } from 'lodash';
import { Category } from '@/utils/common-type';

//Topics: IELTS prep, TOFEL prep, Grammar Focus, Social Topics, Creative Writing,
//Business Writing, Research Writing, Fantasy and Science Fiction
//Poetry and Verse, Serial Writing: some plays or sort, longer story.
//Editorial and Opinion Writing
const AllCategoriesPage: React.FC = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCardLoading, setIsCardLoading] = useState<boolean | string>(false);
  const [originalData, setOriginalData] = useState<
    | {
        category: Category[] | any;
        userId: string | any;
      }
    | any
  >();
  const [data, setData] = useState<
    | {
        category: Category[] | any;
        userId: string | any;
      }
    | any
  >();
  const toast = useToast();

  const onSubscribe = (category_id: string, isSubscribed: boolean) => {
    setIsCardLoading(true);
    axios
      .put('/api/writing/allCategories', { category_id, isSubscribed })
      .then(response => {
        setIsCardLoading(false);
        if (originalData?.category) {
          let newCategory = cloneDeep(originalData?.category);
          const categoryIndex = newCategory.findIndex(
            c => c._id === category_id
          );
          if (isSubscribed && data) {
            newCategory[categoryIndex].subscribed.splice(
              newCategory[categoryIndex].subscribed.indexOf(data.userId),
              1
            );
          } else {
            !newCategory[categoryIndex].subscribed &&
              (newCategory[categoryIndex].subscribed = []);
            data && newCategory[categoryIndex].subscribed.push(data.userId);
          }
          setOriginalData({ ...originalData, category: newCategory });
          setData({ ...data, category: newCategory });
        }
        toast({
          title: 'Subscription updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(error => {
        console.log(error);
        setIsCardLoading(false);
        toast({
          title: 'Error',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const getData = async () => {
    setIsLoading(true);
    !data
      ? axios
          .get('/api/writing/allCategories')
          .then(response => {
            setData(response.data);
            setOriginalData(response.data);
            setIsLoading(false);
          })
          .catch(error => {
            setIsLoading(false);
            toast({
              title: 'Please Reload',
              description: error.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
          })
      : setIsLoading(false);
  };
  useEffect(() => {
    getData();
  }, []);
  return isLoading ? (
    <FullPageLoader />
  ) : (
    data && originalData && (
      <VStack align='center' className='allcategories-container'>
        <VStack className={`main-container ${isLargerThan768 ? '' : 'phone'}`}>
          <FiltersComponent
            type={'category'}
            userId={data.userId}
            data={originalData.category}
            setData={v => setData({ ...data, category: v })}
            visibleFilters={['subscription', 'status', 'language']}
          />

          <Flex
            height={'fit-content'}
            width={'100%'}
            alignItems={'flex-start'}
            wrap={'wrap'}
            justifyContent={isLargerThan768 ? 'flex-start' : 'center'}
          >
            {data?.category?.map((category, index) => {
              let latest: string | false = false;
              if (category?.topics?.length > 0) {
                latest = category.topics[0].name;
                let latestDate = category.topics[0].create_time;

                category.topics.forEach(topic => {
                  if (new Date(topic.create_time) > new Date(latestDate)) {
                    latest = topic.name;
                    latestDate = topic.create_time;
                  }
                });
              }
              return (
                <CategoryCard
                  key={index}
                  category_id={category._id}
                  img=''
                  isLoading={isCardLoading}
                  onSubscribe={(category_id: string) => {
                    onSubscribe(
                      category_id,
                      category?.subscribed?.length > 0 &&
                        category?.subscribed?.includes(data.userId)
                    );
                  }}
                  title={category.name}
                  description={category.short}
                  currentTopic={latest || false}
                  isSubscribed={
                    data.userId && category?.subscribed?.length > 0
                      ? category.subscribed?.includes(data.userId)
                      : false
                  }
                />
              );
            })}
          </Flex>
        </VStack>
      </VStack>
    )
  );
};

export default AllCategoriesPage;
