import {
  Box,
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  VStack,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { GetServerSideProps, NextPage } from 'next';
import EventBlock from '@/components/layout/eventblock';
import Description from '@/components/layout/description';
import EditDraftBlock from '@/components/layout/editdraftblock';
import FeedbackBlock from '@/components/layout/feebackblock';
import axios from 'axios';
import FullPageLoader from '@/components/layout/fullloader';
import { ObjectId } from 'mongodb';
import { DateTime } from 'luxon';
import { Article, Topic } from '@/utils/common-type';

interface DataType {
  article?: Article|any;
  topic?: Topic;
  userId?: string;
}

interface AllEventsPageProps {
  eventId: {id:string};
}

export const getServerSideProps: GetServerSideProps = async context => {
  const { id } = context.params!;

  const eventId = { id };
  return {
    props: { eventId },
  };
};

const TopicPage: NextPage<AllEventsPageProps> = ({ eventId }) => {

  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isSubscribed, setIsSubscribed] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [isPast, setIsPast] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState<boolean | string>(false);
  const [data, setData] = useState<DataType>();
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [isLoading, setIsLoading] = useState<
    'main' | 'submit' | 'subscribe' | false
  >(false);
  const toast = useToast();

  const refreshPage = () => {
    window.location.reload();
  };

  const handlleSubscribe = () => {
    setIsLoading('subscribe');
    // If subscribed =>unsubscribe and delete the article
    // If not subscribed => subscribe and add a new article
    //Res 200: already subscribed
    //Res 202: subscribed and added a new article
    //Res 203: unsubscribed
    data&&axios
      .put(`/api/writing/topic?id=${eventId.id}&method=subscribe`, {
        status: isSubscribed ? 1 : 0,
        topic: data?.topic,
      })
      .then(res => {
        let newtopic: Topic = data.topic as Topic;
        let newArticle: Article;
        if (res.status === 202) {
          if(newtopic.subscribed){
            newtopic.subscribed.push(res.data.userId);
          }else{
            newtopic.subscribed=[res.data.userId];
          }
          newArticle = res.data.article;
          newArticle.last_save = DateTime.fromISO(res.data.article.last_save).toLocal().toFormat('yyyy/MM/dd hh:mm:ss a');
          setData({ ...data, article: newArticle, topic: newtopic });
        }else if(res.status === 203){
          if(newtopic.subscribed){
            newtopic.subscribed = newtopic.subscribed.filter(
            id => id !== data.userId
          );
          }
          setData({topic:newtopic})
        }
        setIsSubscribed(!isSubscribed);
        setIsLoading(false);
        toast({
          title: 'Subscription updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
        toast({
          title: 'An unexpected error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        refreshPage();
      });
  };
  const onSubmit = () => {
    setIsLoading('submit');
    data?.article&&axios
      .put(`/api/writing/topic?id=${data?.article._id}&method=submit`, {
        content: data?.article.content,
      })
      .then(res => {
        setIsSubmitted(true);
        setIsLoading(false);
        setData({
          ...data,
          article: {
            ...data.article,
            status: 1,
            last_save: DateTime.now().toFormat('yyyy-MM-dd hh:mm:ss a'),
          },
        });
        setIsOpen(false);
        toast({
          title: 'Submitted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
        toast({
          title: 'An unexpected error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        refreshPage();
      });
  };
  useEffect(() => {
    setIsLoading('main');
    axios
      .get(`/api/writing/topic?id=${eventId.id}`)
      .then(res => {
        let newData = res.data;
        newData.topic.endtime = DateTime.fromISO(newData.topic.endtime)
          .toLocal()
          .toFormat('yyyy-MM-dd');
        res.data.article &&
          (newData.article.last_save = DateTime.fromISO(
            newData.article.last_save
          )
            .toLocal()
            .toFormat('yyyy/MM/dd hh:mm:ss a'));
        setData(res.data);
        if (res.status === 202) {
          setIsSubscribed(true);
          setIsSubmitted(res.data?.article?.status === 1);
        }
        new Date(res.data.topic.endtime) < new Date() && setIsPast(true);
        setIsLoading(false);
      })
      .catch(err => {
        setIsLoading(false);
        console.log(err);
        toast({
          title: 'An unexpected error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        refreshPage();
      });
  }, []);
  return isLoading === 'main' ? (
    <FullPageLoader />
  ) : (
    <VStack align='center' className='event-container'>
      <VStack
        className={`main-container ${isLargerThan768 ? '' : 'phone'}`}
        spacing={0}
        align={isLargerThan768 ? 'flex-start' : 'center'}
      >
        <HStack
          w={'100%'}
          justify={isLargerThan768 ? 'flex-start' : 'center'}
          align={'center'}
        >
          {data?.topic && (
            <EventBlock {...data?.topic} isSingle={true} clickable={false} />
          )}
          {isLargerThan768 && (
            <Button
              mt='20px'
              height='80px'
              backgroundColor='#ecc94b'
              isDisabled={isLoading === 'submit' || isSubmitted || isPast}
              p={'10px 20px'}
              onClick={() => !isPast && !isSubmitted && handlleSubscribe()}
            >
              {isPast
                ? 'Past Topic'
                : isSubscribed
                  ? 'Unsubscribed'
                  : 'Subscribe'}
            </Button>
          )}
        </HStack>

        {!isSubscribed ? (
          <Box width={'90%'} px={isLargerThan768 ? '25px' : '15px'} mt={'15px'}>
            {data && <Description data={data.topic} />}
          </Box>
        ) : (
          <Tabs
            width={'90%'}
            mx={'20px'}
            index={tabIndex}
            onChange={e => setTabIndex(e)}
          >
            <TabList>
              <Tab>Description</Tab>
              <Tab>{isSubmitted ? 'Submission' : 'Draft'}</Tab>
              {isSubmitted && <Tab>Feedback</Tab>}
            </TabList>
            <TabPanels>
              <TabPanel>
                {data && <Description data={data.topic} isSubscribed={false} />}
              </TabPanel>
              <TabPanel>
                {data&&data.article && (
                  <EditDraftBlock
                    article={data.article}
                    setArticle={v => setData({ ...data, article: v })}
                    isSubmitted={isSubmitted}
                    setIsOpen={() => setIsOpen(true)}
                  />
                )}
              </TabPanel>
              {isSubmitted && (
                <TabPanel>
                  <FeedbackBlock />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        )}
        {!isLargerThan768 && tabIndex === 0 && (
          <Button
            pos={'absolute'}
            bottom='80px'
            backgroundColor='#ecc94b'
            isDisabled={isLoading === 'submit' || isSubmitted || isPast}
            p={'10px 20px'}
            onClick={() => !isPast && !isSubmitted && handlleSubscribe()}
          >
            {isPast
              ? 'Past Topic'
              : isSubscribed
                ? 'Unsubscribed'
                : 'Subscribe'}
          </Button>
        )}
      </VStack>
      <Modal isOpen={!!isOpen} onClose={() => setIsOpen(false)}>
        <ModalOverlay />
        <ModalContent w={'350px'}>
          <ModalHeader>Ready to submit?</ModalHeader>

          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onSubmit}>
              {isOpen === 'suggestion' ? 'Send' : 'Yes'}
            </Button>
            <Button onClick={() => setIsOpen(false)}> Cancel </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  );
};

export default TopicPage;
