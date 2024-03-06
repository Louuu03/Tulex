// components/Header.tsx
import { Flex, Text, Avatar, useMediaQuery, VStack } from '@chakra-ui/react';
import { isEmpty, isNumber } from 'lodash';
import { useRouter } from 'next/router';

interface HeaderProps {
  userName: string;
  userImage: string;
}

const HeaderComponent: React.FC<HeaderProps> = ({ userName, userImage }) => {
  const { pathname } = useRouter();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  let parentTitle = '';

  // Function to convert pathname like '/app/writings' to 'Writings'
  const formatTitle = (path: string) => {
    let returnTitle = '';
    const pathParts = path.split('/'); // Split the path into parts
    let lastPart = pathParts[pathParts.length - 1]; // Get the last part of the path
    if (lastPart === '[id]') {
      lastPart = pathParts[pathParts.length - 2];
      parentTitle = pathParts[pathParts.length - 3];
    }
    returnTitle = lastPart.charAt(0).toUpperCase() + lastPart.slice(1); // Capitalize the first letter
    //get parent's title
    if (
      returnTitle !== 'App' &&
      returnTitle !== 'Writing' &&
      returnTitle !== 'Settings' &&
      returnTitle !== 'Leaderboard' &&
      returnTitle !== 'Speaking'
    ) {
      isEmpty(parentTitle) && (parentTitle = pathParts[pathParts.length - 2]);
    }

    if (returnTitle === 'App') {
      returnTitle = 'Home';
    } else if (returnTitle === 'Allcategories') {
      returnTitle = 'All Categories';
    } else if (returnTitle === 'Alldrafts') {
      returnTitle = 'All Drafts';
    } else if (returnTitle === 'Allsubmissions') {
      returnTitle = 'All Submissions';
    } else if (returnTitle === 'Allevents') {
      returnTitle = 'All Events';
    } else if (returnTitle === 'Myevents') {
      returnTitle = 'My Events';
    } else if (returnTitle === 'Learninglanguages') {
      returnTitle = 'Learning Languages';
    }

    return returnTitle;
  };
  const title = formatTitle(pathname);

  return (
    title!=='Login'?<Flex
      as='header'
      w='100%'
      align='center'
      justify='space-between'
      px='5'
      pb='5px'
      paddingTop='2'
      mb={'5px'}
      position='fixed'
      top='0'
      left='0'
      right='0'
      zIndex='10'
      marginLeft={isLargerThan768 ? '65' : 'initial'}
      boxSize={'border-box'}
      bg={'white'}
    >
      <VStack align={'left'} spacing={0}>
        <Text fontSize='sm' pt={'1'} mb={'-10px'}>
          TULEX{!isEmpty(parentTitle) && ' / ' + parentTitle}
        </Text>
        <Text fontSize='4xl' fontWeight='bold'>
          {title}
        </Text>
      </VStack>
      {title !== 'User' && (
        <Flex align='center'>
          <Text marginRight='3'>{userName}</Text>
          <Avatar size='sm' name={userName} src={userImage} />
        </Flex>
      )}
    </Flex>:''
  );
};

export default HeaderComponent;
