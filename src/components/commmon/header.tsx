// components/Header.tsx
import { Flex, Text, Avatar, useMediaQuery, VStack } from '@chakra-ui/react';
import { isNumber } from 'lodash';
import { useRouter } from 'next/router';

interface HeaderProps {
  userName: string;
  userImage: string;
}

const HeaderComponent: React.FC<HeaderProps> = ({ userName, userImage }) => {
  const { pathname } = useRouter();
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  // Function to convert pathname like '/app/writings' to 'Writings'
  const formatTitle = (path: string) => {
    let returnTitle = '';
    const pathParts = path.split('/'); // Split the path into parts
    let lastPart = pathParts[pathParts.length - 1]; // Get the last part of the path
    lastPart === '[id]' && (lastPart = pathParts[pathParts.length - 2]);
    returnTitle = lastPart.charAt(0).toUpperCase() + lastPart.slice(1); // Capitalize the first letter
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
    }
    return returnTitle;
  };
  const title = formatTitle(pathname);

  return (
    <Flex
      as='header'
      w='100%'
      align='center'
      justify='space-between'
      padding='5'
      paddingTop='2'
      mb={'5px'}
      position='fixed'
      top='0'
      left='0'
      right='0'
      zIndex='10'
      marginLeft={isLargerThan768 ? '65' : 'initial'}
      boxSize={'border-box'}
    >
      <VStack align={'left'} spacing={0}>
        <Text fontSize='sm' pt={'1'} mb={'-10px'}>
          TULEX
        </Text>
        <Text fontSize='4xl' fontWeight='bold'>
          {title}
        </Text>
      </VStack>
      <Flex align='center'>
        <Text marginRight='3'>{userName}</Text>
        <Avatar size='sm' name={userName} src={userImage} />
      </Flex>
    </Flex>
  );
};

export default HeaderComponent;
