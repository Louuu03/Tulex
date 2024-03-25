// Slider.tsx
import React from 'react';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import EventBlock from './eventblock';
import { Box, Flex, Text } from '@chakra-ui/react';
import { GrFormNext } from 'react-icons/gr';
import { useRouter } from 'next/router';

interface SliderProps {
  events: Array<{
    category: string;
    topic: string;
    level: string;
    language: string;
    streak: string;
    date: string;
    statTag: string;
  }>;
  link: string;
}

const Slider: React.FC<SliderProps> = ({ events, link }) => {
  const router = useRouter();
  const SliderColorSet = Math.floor(Math.random() * 9) + 1;
  return (
    events && (
      <Box className='slider-container'>
        <Splide
          width='100%'
          options={{
            type: 'loop',
            perPage: 3,
            breakpoints: {
              640: {
                perPage: 1,
              },
            },
          }}
        >
          {events.map(
            (event, index) =>
              index < 12 && (
                <SplideSlide key={index}>
                  <EventBlock {...event} id={index} colorSet={SliderColorSet} />
                </SplideSlide>
              )
          )}
          <SplideSlide className='more-container'>
            <Flex
              align='center'
              justify='center'
              className='background'
              border={'2px solid black'}
              onClick={() => router.push(link)}
              cursor={'pointer'}
            >
              <Text fontWeight={'600'}>More</Text>
              <GrFormNext />
            </Flex>
          </SplideSlide>
        </Splide>
      </Box>
    )
  );
};

export default Slider;
