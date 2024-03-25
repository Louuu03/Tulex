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
  data: {
    steps: {
      name: string;
      details: string;
    }[];
    description: string;
    example: string[];
  };
}

const Description: React.FC<DescriptionProps|any> = ({ data }) => {
  return (
    <VStack w={'100%'} align={'flex-start'}>
      <Text textAlign={'justify'}>{data.description}</Text>
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
            {data.steps?.map((step, idx) => (
              <AccordionItem key={'step' + idx}>
                <h3>
                  <AccordionButton px={2}>
                    <Box as='span' flex='1' textAlign='left'>
                      {idx + 1 + '. ' + step.name}
                    </Box>
                    <AccordionIcon />
                  </AccordionButton>
                </h3>
                <AccordionPanel px={3}>{step.details}</AccordionPanel>
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
            {data.example?.map((paragraph, idx) => (
              <Text key={idx}>{paragraph}</Text>
            ))}
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    </VStack>
  );
};

export default Description;
