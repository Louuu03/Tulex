// Slider.tsx
import React from 'react';
import EventBlock from './eventblock';
import { Box, Flex, Text } from '@chakra-ui/react';

const InputFile: React.FC = ({}) => {
  return (
    <Box className='inputfile-container'>
      <label htmlFor='file-upload' className='inputfile-label'>
        Uplaod Photo
      </label>
      <input
        type='file'
        id='file-upload'
        className='inputfile-input'
        accept='image/*'
      />
    </Box>
  );
};

export default InputFile;
