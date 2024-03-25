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
    category_name?: string;
  name: string;
  level: number;
  language: string;
  streak?: string;
  endtime: string | Date;
  statTag?: string;
  isSmall?: boolean;
  isSubscribed?: boolean;
  _id: string | number;
  isSingle?: boolean;
  clickable?: boolean;
  isTag?: boolean;
  topic_id?: string;
  id?: number;
  colorSet?: number;
  }>;
  link: string;
}

const Slider: React.FC<SliderProps|any> = ({ events, link }) => {
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
