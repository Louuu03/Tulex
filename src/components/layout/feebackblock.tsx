// Slider.tsx
import React, { useState } from 'react';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Text,
  Textarea,
  Tooltip,
  VStack,
} from '@chakra-ui/react';
import fakeData from '@/utils/fakedata';

interface FeedbackBlockProps {}
interface HighlightProps {
  text: string;
  explanation: string;
}

interface ArticleProps {
  text: string;
  highlights: { word: string; explanation: string }[];
}

const Article: React.FC<ArticleProps> = ({ text, highlights }) => {
  const regex = new RegExp(`(${highlights.map(h => h.word).join('|')})`, 'gi');
  const parts = text.split(regex);

  return (
    <p>
      {parts.map((part, index) => {
        const highlight = highlights.find(h =>
          new RegExp(h.word, 'i').test(part)
        );
        return highlight ? (
          <Highlight
            key={index}
            text={part}
            explanation={highlight.explanation}
          />
        ) : (
          <span key={index}>{part}</span>
        );
      })}
    </p>
  );
};

const Highlight: React.FC<HighlightProps> = ({ text, explanation }) => {
  return (
    <Tooltip label={explanation} placement='top' hasArrow>
      <span style={{ backgroundColor: 'yellow', cursor: 'pointer' }}>
        {text}
      </span>
    </Tooltip>
  );
};
const FeedbackBlock: React.FC<FeedbackBlockProps> = ({}) => {
  const [isResult, setIsResult] = useState(false);

  return (
    <Box className='feedbackblock-container'>
      {isResult ? (
        <VStack>
          <HStack width={'100%'} justify={'flex-end'} mb={2}>
            <Text width='250px'>{fakeData.feedbackData.line}</Text>
            <Flex
              justify={'center'}
              align={'center'}
              width='70px'
              h='70px'
              borderRadius={'50%'}
              bg={'gold'}
              fontWeight={'600'}
              fontSize={'30px'}
            >
              {fakeData.feedbackData.rating}
            </Flex>
          </HStack>
          <Box bg={'#eee3bac2'} p={2} borderRadius={'10px'} px={4}>
            {fakeData.feedbackData.feedback}
          </Box>
          <Text
            mt={2}
            w={'100%'}
            textAlign={'left'}
            fontWeight={'600'}
            fontSize={'20px'}
          >
            Optimal Article
          </Text>
          <Box px={2}>
            <Article
              text={fakeData.feedbackData.article}
              highlights={fakeData.feedbackData.highlights}
            />
          </Box>
        </VStack>
      ) : (
        <Center h={'200px'} flexDirection={'column'}>
          <Text display={'block'}>GPT is right now checking it,</Text>
          <Text display={'inline-block'}>please wait ....</Text>
        </Center>
      )}
    </Box>
  );
};

export default FeedbackBlock;
