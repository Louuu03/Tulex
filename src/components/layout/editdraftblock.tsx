// Slider.tsx
import React from 'react';
import {
  Box,
  Button,
  Flex,
  HStack,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react';

interface EditDraftBlockProps {
  isSubmitted?: boolean;
}

const EditDraftBlock: React.FC<EditDraftBlockProps> = ({ isSubmitted }) => {
  return (
    <Box className='editdraftblock-container'>
      <HStack justify={'space-between'}>
        <VStack
          align={'flex-start'}
          spacing={0}
          color={'gray'}
          fontSize={'14px'}
        >
          <Text>{isSubmitted ? 'Submission:' : 'Last Saved:'}</Text>
          <Text>2023-03-27 18:07</Text>
        </VStack>
        {!isSubmitted && (
          <HStack mb={2} justifyContent={'flex-end'}>
            <Button>Save</Button>
            <Button bg={'#ecc94b'}>Submit</Button>
          </HStack>
        )}
      </HStack>
      <Textarea
        placeholder='Start writing here...'
        rows={20}
        isDisabled={isSubmitted}
      />
    </Box>
  );
};

export default EditDraftBlock;
