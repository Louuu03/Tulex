import fakeData from '@/utils/fakedata';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
  VStack,
} from '@chakra-ui/react';

interface DescriptionProps {
  isSubscribed: boolean;
}
const Description: React.FC<DescriptionProps> = ({ isSubscribed }) => {
  return (
    <VStack w={'100%'}>
      <Text textAlign={'justify'}>
        {fakeData.alleventsData[0].introduction}
      </Text>
      <Accordion defaultIndex={[0]} allowMultiple w={'100%'}>
        <AccordionItem>
          <h2>
            <AccordionButton px={0}>
              <Box fontWeight='600' as='span' flex='1' textAlign='left' pl={2}>
                Guide steps
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={0}>
            {fakeData.alleventsData[0].guide_steps?.map((step, idx) => (
              <AccordionItem>
                <h3>
                  <AccordionButton px={2}>
                    <Box as='span' flex='1' textAlign='left'>
                      {idx + 1 + '. ' + step.title}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel px={3}>{step.description}</AccordionPanel>
              </AccordionItem>
            ))}
          </AccordionPanel>
        </AccordionItem>
        <AccordionItem>
          <h2>
            <AccordionButton px={0}>
              <Box fontWeight='600' as='span' flex='1' textAlign='left' pl={2}>
                Example Article
              </Box>
              <AccordionIcon />
            </AccordionButton>
          </h2>
          <AccordionPanel px={2}>
            {fakeData.alleventsData[0].article?.map((paragraph, idx) => (
              <Text key={idx}>{paragraph}</Text>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};

export default Description;
