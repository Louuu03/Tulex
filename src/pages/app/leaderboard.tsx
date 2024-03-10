import HeaderComponent from '@/components/commmon/header';
import Navbar from '@/components/commmon/navbar';
import { Text, VStack, useMediaQuery } from '@chakra-ui/react';
import React from 'react';

const LeaderBoardPage: React.FC = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  return (
    <VStack align='center' className='leaderboard-container'>
      <VStack
        className={`main-container ${isLargerThan768 ? '' : 'phone'}`}
        marginLeft={isLargerThan768 ? '65px' : 'initial'}
        spacing={0}
      >
        <Text pt={'300px'} fontSize={'5xl'}>
          Coming soon
        </Text>
      </VStack>
    </VStack>
  );
};

export default LeaderBoardPage;
