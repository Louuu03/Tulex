import { Text, VStack, useMediaQuery } from '@chakra-ui/react';
import React from 'react';

const WritingRulesPage: React.FC = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  return (
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
          So, where do I start?
        </Text>
        <Text maxW='1200px' mt={'20px'} fontWeight='700' fontSize={'18px'}>
          Hello there, ready to explore the vast seas of language without
          needing a compass? Here&apos;s your simple map to start the voyage:
        </Text>
        <Text maxW='1200px' fontWeight='600' fontSize={'16px'} mt={'10px'}>
          1. Kick off with Categories:
        </Text>
        <Text maxW='1200px' pl={'15px'}>
          They&apos;re like the sections of a library, but without the need for those
          pesky  &apos;Quiet Please&apos; signs. Pick a category that tickles your fancy,
          and you&apos;ll find a treasure trove of topics waiting for you. From tales
          to prose, there&apos;s something for everyone!
        </Text>
        <Text maxW='1200px' fontWeight='600' fontSize={'16px'} mt={'10px'}>
          2. Pick Your Challenge:
        </Text>
        <Text maxW='1200px' pl={'15px'}>
          Topics are like mini-missions, each with its unique flavor and
          challenge. Whether it&apos;s an easy stroll or a steep climb, choose one
          that matches your mood and language preference. Guides and examples?
          Got&apos;em to ensure you&apos;re never lost.
        </Text>
        <Text maxW='1200px' fontWeight='600' fontSize={'16px'} mt={'10px'}>
          3. Subscribe to Start:
        </Text>
        <Text maxW='1200px' pl={'15px'}>
          Imagine subscribing as saying &apos;Yes!&apos; to a writing party. This unlocks
          the &apos;draft&apos; zone, where your ideas can dance freely on the digital
          page.
        </Text>
        <Text maxW='1200px' fontWeight='600' fontSize={'16px'} mt={'10px'}>
          4. Write, Submit, and Smile:
        </Text>
        <Text maxW='1200px' pl={'15px'}>
          After you&apos;ve crafted your masterpiece, send it off into the world with
          a click. Sit back and relax—feedback from our friendly AI, ChatGPT 4,
          will swing by in about 5 minutes.
        </Text>
        <Text maxW='1200px' fontWeight='700' fontSize={'18px'} mt={'10px'}>
          Understanding Categories:
        </Text>
        <Text maxW='1200px'>
          Imagine categories as your favorite genres in a bookstore. When you
          &apos;subscribe&apos; to one of these genres, it&apos;s like signing up for a
          membership that gives you first dibs on every book (topic) currently
          available in that genre, plus all the new releases that arrive each
          week. It&apos;s a hassle-free way to ensure you never miss out on content
          that&apos;s right up your alley. In short, subscribing to a category
          automatically signs you up for both the topics that are there right
          now and the ones that will be added in the future.
        </Text>
        <Text maxW='1200px' fontWeight='700' fontSize={'18px'} mt={'20px'}>
          What Topics Are:
        </Text>
        <Text maxW='1200px' mt={'10px'}>
          Imagine topics as little quests designed just for you. They&apos;re
          exciting because there&apos;s a bit of a countdown to complete them. To
          start this adventure, you&apos;ll need to &apos;subscribe&apos; to the topic itself.
          If the timer runs out before you&apos;re done, no stress! We automatically
          take your work and get it ready for some helpful feedback, ensuring
          your hard work gets the attention it deserves.
        </Text>
        <Text maxW='1200px' fontWeight='600' fontSize={'18px'} mt={'20px'}>
          Feedback: A Friendly Nudge:
        </Text>
        <Text maxW='1200px' mt={'10px'}>
          After you&apos;ve put your thoughts down on paper, our AI feedback system
          jumps in like a buddy who&apos;s always there to help. It celebrates what
          you&apos;ve done well and gently suggests how you can make your writing
          even better. Plus, it explains why certain suggestions are made,
          making it easier for you to get better each time.
        </Text>
        <Text maxW='1200px' fontWeight='600' fontSize={'18px'} mt={'20px'}>
          Navigating Your Writing Adventures:
        </Text>
        <Text maxW='1200px' mt={'10px'}>
          When it comes to &apos;subscribing&apos;, here&apos;s what happens:
        </Text>
        <Text
          maxW='1200px'
          pl={'15px'}
          fontWeight='600'
          fontSize={'16px'}
          mt={'10px'}
        >
          Subscribe to a Category:
        </Text>
        <Text maxW='1200px' pl={'15px'}>
          You&apos;re automatically in tune with everything happening within that
          category. Think of it as your all-access pass to every current and
          upcoming topic under that theme.
        </Text>
        <Text
          maxW='1200px'
          pl={'15px'}
          fontWeight='600'
          fontSize={'16px'}
          mt={'10px'}
        >
          Subscribe to a Topic:
        </Text>
        <Text maxW='1200px' pl={'15px'}>
          This is your RSVP to a specific challenge. It means you&apos;re ready to
          throw your hat in the ring and start crafting your response to that
          topic.
        </Text>

        <Text maxW='1200px' mt={'10px'}>
          And when looking for your work:
        </Text>
        <Text
          maxW='1200px'
          pl={'15px'}
          fontWeight='600'
          fontSize={'16px'}
          mt={'10px'}
        >
          My Drafts:
        </Text>
        <Text maxW='1200px' pl={'15px'}>
          This section is your workbench, where all your ongoing projects live.
          It&apos;s where you can pick up right where you left off.
        </Text>
        <Text
          maxW='1200px'
          pl={'15px'}
          fontWeight='600'
          fontSize={'16px'}
          mt={'10px'}
        >
          4. Write, Submit, and Smile:
        </Text>
        <Text maxW='1200px' pl={'15px'}>
          Consider this your trophy case, a place to reflect on what you&apos;ve
          accomplished. It&apos;s a collection of all the topics you&apos;ve tackled and
          submitted, showcasing your progress and achievements.
        </Text>
      </VStack>
    </VStack>
  );
};

export default WritingRulesPage;
