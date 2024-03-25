import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
  useMediaQuery,
  useDisclosure, 
  IconButton
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Link from 'next/link';
import { Splide, SplideSlide } from '@splidejs/react-splide';
import '@splidejs/splide/dist/css/splide.min.css';
import { IoMenu, IoClose  } from "react-icons/io5";


const Navbar = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const { isOpen, onToggle } = useDisclosure();

  return (
    <Flex
      as='nav'
      align='center'
      justify='space-between'
      wrap='wrap'
      bg='white'
      position='fixed'
      top={0}
      right={0}
      left={0}
      zIndex={1000}
      h={isLargerThan768?'70px':'50px'}
      boxShadow={'1px 1px 2px rgba(0, 0, 0, 0.1)'}
      className='navbar'
      px={isLargerThan768 ? '60px' : '20px'}
    >
      <HStack pb={isLargerThan768 ? '10px' : 0}>
        <Text
          color='#ecc94b'
          fontSize={isLargerThan768 ? '40px' : (isLargerThan768?'35px':'30px')}
          fontWeight={isLargerThan768 ? '700' : '600'}
        >
          Tulex
        </Text>
        <Text ml='-8px' fontSize={isLargerThan768 ? '40px' : (isLargerThan768?'35px':'30px')} fontWeight={'800'} color={'tomato'}>
          .
        </Text>
      </HStack>
      {isLargerThan768?<Box
        display={{ base: 'none', md: 'block' }}
        flexBasis={{ base: '100%', md: 'auto' }}
      >
        <HStack
          align='center'
          justify={['center', 'space-between', 'flex-end', 'flex-end']}
          spacing={6}
        >
          <Link href='#writing'>Writing</Link>
          <Link href='#speaking'>Speaking</Link>
          <Link href='#plans'>Pricing</Link>
          <Button
            bg={'#ecc94b'}
            color='black'
            aria-label='Writing'
            my={5}
            w='100%'
          >
            Sign Up
          </Button>
          <Link href='/app/login'>Login</Link>
        </HStack>
      </Box>:  <Box zIndex={9000} position={'relative'}>
               <Box display={{ base: 'block', md: 'none' }}>
        <IconButton
          onClick={onToggle}
          bg='none'
          size={'lg'}
          icon={isOpen ? <IoClose /> : <IoMenu />}
          aria-label={'Toggle Navigation'}
        />
      </Box>
      <VStack
        display={isLargerThan768 ? 'none' : isOpen ? 'flex' : 'none'}
        flexBasis={{ base: '100%', md: 'auto' }}
        position='absolute'
        top={'50px'}

        right={'0'}
        bg='white'
        py='20px'
        borderRadius={'10px'}
        width={'250px'}
        justify={'center'}
      >
        <VStack
          align='center'
          justify={'center'}
          spacing={6}
          width={'220px'}
        >
          <Link href='#writing'>Writing</Link>
          <Link href='#speaking'>Speaking</Link>
          <Link href='#plans'>Pricing</Link>
          <Button
            bg={'#ecc94b'}
            color='black'
            aria-label='Writing'
            mt={5}
            w='100%'
          >
            Sign Up
          </Button>
          <Button
            bg={'black'}
            color='white'
            aria-label='Writing'
            mt={'-15px'}
            w='100%'
          >
            Login
          </Button>
        </VStack>
      </VStack>
            </Box>
      }
    </Flex>
  );
};

const LandingPage: React.FC = () => {
  //for Ipad or smaller llandscape screen
  const [isLargerThan930] = useMediaQuery('(min-width: 930px)');
  const [isLargerThan1300] = useMediaQuery('(min-width: 1300px)');
  // for phone
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [scrollY, setScrollY] = useState(0);
  const [show, setShow] = useState(false);
  const { isOpen, onToggle } = useDisclosure();

  const handleScroll = () => {
    setScrollY(window.scrollY);
    isOpen&&onToggle();
    if (window.scrollY > 70) {
      setShow(true);
    } else {
      setShow(false);
    }
  };
  const calcX = y => isLargerThan768?-(y * 5):(y * 5); // Adjust movement speed/direction for X
  const calcY = y => isLargerThan768?(y * 3):(y * 2.3); // Adjust movement speed/direction for Y

  const [{ xy }, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 500, friction: 140 },
  }));

  useEffect(() => {
    set({ xy: [calcX(scrollY), calcY(scrollY)] });
  }, [scrollY, set]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Box className='LandingPage-container' color={'#313e58'} fontWeight={'500'}>
      {show && <Navbar />}
      <Box minH='200vh' bg='#FFFCF3'>
        
        <Box h='100vh' bg='#ecc94b' overflow={'hidden'} maxH={isLargerThan768?'900px':'650px'} zIndex={100}>
          <HStack
            w={'100%'}
            justify={'space-between'}
            position={'relative'}
            px={isLargerThan1300 ? '60px' : '20px'}
            zIndex={300}
          >
            <VStack align={'flex-start'} pt='20px'>
              <HStack>
                <Text
                  as={'h1'}
                  color={'white'}
                  fontSize={isLargerThan768?'35px':'30px'}
                  lineHeight={'20px'}
                  fontWeight={'600'}
                >
                  Tulex
                </Text>
                <Text
                  fontSize={'35px'}
                  lineHeight={'20px'}
                  ml={'-8px'}
                  fontWeight={'600'}
                  color={'tomato'}
                >
                  .
                </Text>
              </HStack>
              <Text
                as={'h2'}
                color={'black'}
                fontSize={isLargerThan930?'30px':(isLargerThan768?'25px':'20px')}
                lineHeight={isLargerThan930?'15px':'20px'}
                fontWeight={'600'}
                mb={isLargerThan930?"0px":'-10px'}
              >
                The Ultimate Exchange
              </Text>
            </VStack>
           {isLargerThan930? <HStack spacing={6} pt='30px' fontWeight={'600'} fontSize={'20px'}>
              <Text color={'black'}>
                <Link href='#writing'>Writing</Link>
              </Text>
              <Text color={'white'}>
                <Link href='#speaking'>Speaking</Link>
              </Text>
              <Text color={'white'}>
                <Link href='#plans'>Pricing</Link>
              </Text>
              <Button
                size={'lg'}
                ml='80px'
                fontWeight={'600'}
                fontSize={'20px'}
              >
                Sign up
              </Button>
              <Link href='/app/login'>Login</Link>
            </HStack>:
            <Box zIndex={9000} position={'relative'}>
               <Box display={{ base: 'block', md: 'none' }}>
        <IconButton
          onClick={onToggle}
          bg='none'
          size={'lg'}
          icon={isOpen ? <IoClose /> : <IoMenu />}
          aria-label={'Toggle Navigation'}
        />
      </Box>
      <VStack
        display={isLargerThan768 ? 'none' : (isOpen&&!show) ? 'flex' : 'none'}
        flexBasis={{ base: '100%', md: 'auto' }}
        position='absolute'
        top={'40px'}
        right={'0'}
        bg='white'
        py='20px'
        borderRadius={'10px'}
        width={'250px'}
        justify={'center'}
      >
        <VStack
          align='center'
          justify={'center'}
          spacing={6}
          width={'220px'}
        >
          <Link href='#writing'>Writing</Link>
          <Link href='#speaking'>Speaking</Link>
          <Link href='#plans'>Pricing</Link>
          <Button
            bg={'#ecc94b'}
            color='black'
            aria-label='Writing'
            mt={5}
            w='100%'
          >
            Sign Up
          </Button>
          <Button
            bg={'black'}
            color='white'
            aria-label='Writing'
            mt={'-15px'}
            w='100%'
          >
            Login
          </Button>
        </VStack>
      </VStack>
            </Box>
            
            }
          </HStack>
          <Box position={'relative'} zIndex={100}>
          {isLargerThan768?    <animated.div

            style={{
              transform: xy.to(
                (x, y) => `translate3d(${x}px,${y}px,0) rotate(-30deg)`
              ),
              position:'absolute',
              top:'130px',
              right:'-60px',
              zIndex:100
            }}
          >
            <Image
              src='/pictures/main.png'
              alt='Dynamic Image'
              w='700px'
              
            />
          </animated.div>:
          <animated.div

          style={{
            transform: xy.to(
              (x, y) => `translate3d(${x}px,${y}px,0) rotate(25deg)`
            ),
            position:'absolute',
            top:'75px',
            left:'-180px',
            zIndex:100
          }}
        >
          <Image
            src='/pictures/main.png'
            alt='Dynamic Image'
            w='450px'
            
          />
        </animated.div>}
          </Box>
        
          <Box className='Pattern' position={'relative'} zIndex={1} w='100%'>
            <Box
              width={isLargerThan768?'150px':'100px'}
              height='1200px'
              bg='black'
              transform={isLargerThan768?'rotate(-30deg)':'rotate(-65deg)'}
              position={'absolute'}
              top='-150px'
              right={'50px'}
              zIndex={1}
            ></Box>
            <Box
              width={isLargerThan768?'170px':'100px'}
              height='1500px'
              bg='black'
              transform={isLargerThan768?'rotate(60deg)':'rotate(25deg)'}
              position={'absolute'}
              top={isLargerThan768?'100px':'400px'}
              right={isLargerThan768?'700px':'400px'}
              zIndex={1}
            ></Box>
          </Box>
          <VStack
            mt={isLargerThan930?'230px':(isLargerThan768?"150px":"80px")}
            align={isLargerThan768?'flex-start':'flex-end'}
            fontWeight={'800'}
            pl={'100px'}
            pr='50px'
            position={'relative'}
            zIndex={100}
          >
            <Text
              as='h2'
              fontSize={isLargerThan768?'70px':'45px'}
              color={isLargerThan768?'white':'black'}
              textAlign={isLargerThan768?'left':'right'}
              zIndex={100}
            >
              Slide to Fluency
            </Text>
            <Text
              as='h3'
              fontSize={isLargerThan930 ? '50px' : (isLargerThan768?'40px':'20px')}
              width={isLargerThan1300 ?'100%':(isLargerThan768?'50%':'180px')}
              textAlign={isLargerThan768?'left':'right'}
              color={isLargerThan768?'black':'white'}
              zIndex={100}
            >
              Where Languages Flow Smoothly
            </Text>
           {isLargerThan768&& <Box>
              <Text onClick={()=>router.push('/app/login')}fontSize={isLargerThan930?'20px':'18px'} textDecor={'underline'}>
                 Peek into our app as a guest
              </Text>
             
              </Box>}
            <Box
              width='100px'
              height='100px'
              bg='tomato'
              transform='rotate(30deg)'
              position={'absolute'}
              top={isLargerThan768?'10px':'60px'}
              left={isLargerThan768?'60px':''}
              right={isLargerThan768?'':'30px'}
              zIndex={1}
            ></Box>
            {!isLargerThan768&& <Box position={'absolute'} bottom={'-300px'} left={'20px'}>
              <Text onClick={()=>router.push('/app/login')} fontSize={'15px'} textDecor={'underline'}>
                 Peek into our app as a guest
              </Text>
             
              </Box>}
          </VStack>
          
        </Box>

        <VStack>
          {/* App description */}
          <HStack mt={isLargerThan768?'150px':'100px'} width={'100%'} justify={'center'} px="20px">
            <Box maxW={isLargerThan1300?'550px':'400px'}>
              <Text as='h3' fontSize={isLargerThan768?'40px':'30px'} fontWeight={'700'} textAlign={isLargerThan768?'left':'center'}>
                Lost in Language Land?{' '}
              </Text>
              <Text
                as='h3'
                fontSize={isLargerThan768?'30px':'23px'}
                fontWeight={'700'}
                color={'tomato'}
                textAlign={isLargerThan768?'left':'center'}
              >
                Let Tulex Be Your Guide:{' '}
              </Text>
              <Text
                as='h3'
                fontSize={isLargerThan768?'30px':'23px'}
                fontWeight={'700'}
                color={'tomato'}
                textAlign={isLargerThan768?'left':'center'}
              >
                Where Every Word’s a Win.{' '}
              </Text>
              <Text maxW={isLargerThan768?'500px':'350px'} mt={'10px'} fontSize={'18px'} textAlign={isLargerThan768?'left':'center'}>
              Slide into Tulex's exciting language adventure! We blend humor with expert tips for a lively learning experience in speaking and writing. Weekly themes spark your creativity, making the process as delightful as the mastery. Embark on a fun, educational journey where laughter enhances learning.
              </Text>
            </Box>
           {isLargerThan768&& <HStack wrap={'wrap'} w={isLargerThan1300?'520px' :"260px"} h={isLargerThan1300?'360px' :"520px"}>
              <Image
                src='/pictures/Guide2.jpg'
                alt='Guide'
                width={'250px'}
                h={isLargerThan1300?'350px':'250px'}
                objectFit={'cover'}
              />
              <Image
                src='/pictures/Guide1.jpg'
                alt='Guide'
                width={'250px'}
                h={isLargerThan1300?'350px':'250px'}
                objectFit={'cover'}
                
              />
            </HStack>}
            <Box id='writing'></Box>
          </HStack>
          {!isLargerThan768&& <HStack wrap={'wrap'} w={'100%'} justify={'center'} mt='10px'>
              <Image
                src='/pictures/Guide2.jpg'
                alt='Guide'
                width={'180px'}
                h='200px'
                objectFit={'cover'}
              />
              <Image
                src='/pictures/Guide1.jpg'
                alt='Guide'
                width={'180px'}
                h='200px'
                objectFit={'cover'}
                
              />
            </HStack>}
          {/* Writing */}
          <VStack
            mt={isLargerThan768?'150px':'100px'}
            width={'70%'}
            bg='#eed5bac2'
            pb={'40px'}
            px={'40px'}
            borderRadius={'10px'}
          >
            <VStack mt={'-100px'}>
              <Image src='/pictures/paper.png' alt='Writing' width={'60px'} />
              <Text
                as='h4'
                fontSize={'40px'}
                fontWeight={'700'}
                textShadow={'5px -5px #ecc94b'}
                textAlign={'center'}
              >
                Why Writing?
              </Text>
            </VStack>

            <Text fontSize={isLargerThan768?'18px':'16px'} textAlign={isLargerThan768?'left':'center'}>
            Learning languages through writing is like crafting a message to a crush: you pause, choose your words, and aim for the grammar to spark. It's a kind of practical magic that enhances memory, clarifies complex grammar, and deepens your vocabulary love affair. Plus, witnessing your progress is like capturing the evolution of your linguistic allure. In essence, writing hones your skills and transforms you into a slick grammar expert.
            </Text>
          </VStack>
          <HStack mt='50px' width={'70%'} justify={isLargerThan768?'space-between':'center'} wrap={isLargerThan768?'nowrap':'wrap'}>
            <VStack width={isLargerThan768?'47%':'350px' } justify={'center'} className='writing-container'>
              <Box
                position={'relative'}
                borderRadius={'20px'}
                overflow={'hidden'}
                w={'100%'}
              >
                <Image
                  src='/pictures/theme.jpg'
                  alt='Writing'
                  h={'350px'}
                  objectFit={'cover'}
                  w={'100%'}
                />
                <Center
                  w={'100%'}
                  h={'100%'}
                  position={'absolute'}
                  top={0}
                  left={0}
                  zIndex={50}
                  bg='#000000'
                  opacity={0.6}
                ></Center>

                <Center
                  w={'100%'}
                  h={'100%'}
                  position={'absolute'}
                  top={0}
                  left={0}
                  zIndex={100}
                >
                   <Text as='h4' fontSize={'30px'} fontWeight={'600'} textAlign={'center'} color='white'className='title-container'>
                Themed Writing Challenges
              </Text>
                  <Text
                    width={'80%'}
                    color={'white'}
                    fontSize={'18px'}
                    fontWeight={'500'}
                    className='text-container'
                    display={'none'}

                  >
Elevate your language skills with Tulex's Themed Writing Challenges. From Grammar to IELTS Prep, our weekly prompts are tailored to your learning objectives, offering both challenge and clarity in expression.
                  </Text>
                  
                </Center>
              </Box>
            </VStack>

            <VStack width={isLargerThan768?'47%':'350px' } justify={'center'} className='writing-container'>
              <Box
                position={'relative'}
                borderRadius={'20px'}
                overflow={'hidden'}
                w={'100%'}
              >
                <Image
                  src='/pictures/mentor.jpg'
                  alt='Writing'
                  h={'350px'}
                  objectFit={'cover'}
                  w={'100%'}
                />
                <Center
                  w={'100%'}
                  h={'100%'}
                  position={'absolute'}
                  top={0}
                  left={0}
                  zIndex={50}
                  bg='#000000'
                  opacity={0.6}
                ></Center>
                <Center
                  w={'100%'}
                  h={'100%'}
                  position={'absolute'}
                  top={0}
                  left={0}
                  zIndex={100}
                >
                   <Text as='h4' fontSize={'30px'} fontWeight={'600'} textAlign={'center'} color='white' className='title-container'>
                Personalized Feedback
              </Text>
                  <Text
                    width={'80%'}
                    color={'white'}
                    fontSize={'18px'}
                    fontWeight={'500'}
                    className='text-container'
                    display={'none'}
                  >
                    Tulex offers personalized feedback on your writing, acting as your mentor for growth. Our feedback highlights your strengths and areas for improvement, like having a writing coach dedicated to enhancing your skills.
                  </Text>
                </Center>
              </Box>
            </VStack>
          </HStack>
          <Box id='speaking'></Box>
          {/* Speaking */}
          <Box
            mt={'150px'}
            position={'relative'}
            width={'100%'}
          >
            <Image
              src='/pictures/map.jpg'
              alt='Speaking'
              position={'relative'}
              width={'100vw'}
              opacity={0.15}
              height={isLargerThan1300?'800px':isLargerThan768?'1000px':"1300px"}
              objectFit={'cover'}
              zIndex={80}
            />
            <VStack
              position={'absolute'}
              top={10}
              left={0}
              zIndex={100}
              width={'100%'}
              height={'100%'}
              justify={'flex-start'}
            >
              <Text
                as='h4'
                fontSize={'40px'}
                fontWeight={'600'}
                mb={'20px'}
                textAlign='left'
                width={'70%'}
              >
                Speaking
              </Text>
              <Text fontSize={'20px'} textAlign='left' width={'70%'}>
              Transform your language practice with Tulex into a fun, engaging experience. We provide a wealth of materials to keep conversations lively, from conversation starters to key language structures. It's like your guidebook for exciting language adventures. With us, every conversation is a chance to learn, laugh, and progress towards fluency, making sure you're always primed for smooth chatting.
              </Text>
              <HStack mt={'60px'} width={isLargerThan1300?'70%':'90%'} justify={isLargerThan768?'space-between':'center'} wrap={isLargerThan768?'nowrap':'wrap'}>
                <VStack w={isLargerThan768?'33%':'90%'}  padding={'10px'} >
                  <Center
                    bg='#ecc94b'
                    width={'100px'}
                    height={'100px'}
                    borderRadius={'50%'}
                    p='20px'
                  >
                    <Image
                      src='/pictures/Choose.png'
                      alt='Speaker'
                      width={'200px'}
                    />
                  </Center>
                  <Text fontSize={isLargerThan1300? '25px' : '20px'} fontWeight={'600'}>
                    STEP 1
                  </Text> 
                  <Text fontSize={isLargerThan1300? '25px' : '18px'} fontWeight={'600'} textAlign={'center'} h={isLargerThan1300?'35px':'50px'}>
                    Choose an event
                  </Text>
                  <Text
                    py={'10px'}
                    px={'20px'}
                    fontSize={'18px'}
                    bg={'white'}
                    borderRadius={'10px'}
                    h={isLargerThan1300?'220px':'320px'}
                    display={isLargerThan768?'block':'none'}

>
                    Choose your adventure by selecting a speaking event that
                    tickles your fancy from our vibrant calendar. It’s like
                    picking the perfect date, but for your brain.
                  </Text>
                </VStack>
                <VStack w={isLargerThan768?'33%':'90%'} padding={'10px'} >
                  <Center
                    bg='#ecc94b'
                    width={'100px'}
                    height={'100px'}
                    borderRadius={'50%'}
                    p='20px'
                  >
                    <Image
                      src='/pictures/planning.png'
                      alt='Speaker'
                      width={'200px'}
                    />
                  </Center>
                  <Text fontSize={isLargerThan1300? '25px' : '20px'} fontWeight={'600'} >
                    STEP 2
                  </Text>
                  <Text fontSize={isLargerThan1300? '25px' : '18px'} fontWeight={'600'} textAlign={'center'} h={isLargerThan1300?'35px':'50px'}>
                    Prep with Our Materials
                  </Text>
                  <Text
                    py={'10px'}
                    px={'20px'}
                    fontSize={'18px'}
                    bg={'white'}
                    borderRadius={'10px'}
                    h={isLargerThan1300?'220px':'320px'}
                    display={isLargerThan768?'block':'none'}

                  >
                    Equip yourself with our custom materials, featuring conversation starters and sentence structures. It's like donning linguistic armor for the banter battle.
                  </Text>
                </VStack>
                <VStack w={isLargerThan768?'33%':'90%'}  padding={'10px'}>
                  <Center
                    bg='#ecc94b'
                    width={'100px'}
                    height={'100px'}
                    borderRadius={'50%'}
                    p='15px'
                  >
                    <Image
                      src='/pictures/conversation.png'
                      alt='Speaker'
                      width={'200px'}
                    />
                  </Center>
                  <Text fontSize={isLargerThan1300? '25px' : '20px'} fontWeight={'600'}>
                    STEP 3
                  </Text>
                  <Text fontSize={isLargerThan1300? '25px' : '18px'} fontWeight={'600'} textAlign={'center'} h={isLargerThan1300?'35px':'50px'}>
                    Dive into the Digital Soiree
                  </Text>
                  <Text
                    py={'10px'}
                    px={'20px'}
                    fontSize={'18px'}
                    bg={'white'}
                    borderRadius={'10px'}
                    h={isLargerThan1300?'220px':'320px'}
                    display={isLargerThan768?'block':'none'}
                  >
                    Our virtual speaking events transform video calls into a lifelike language exchange. Imagine roaming a digital party, chatting and mingling as if in person.
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>
          <Box id='plans'></Box>
          {/* Pricing */}
          <VStack mt='100px' width={'100%'} justify={'space-between'}>
            <HStack width='100%' justify={'center'} wrap={'wrap'} >
              <VStack align={'center'} maxW={'400px'} mb={'25px'}>
                <Text
                  as='h3'
                  fontSize={'35px'}
                  fontWeight={'700'}
                  lineHeight={'35px'}
                  textAlign={'center'}
                >
                  Unleash Your Words with Tulex
                </Text>
                <Text
                  as='h3'
                  fontSize={'25px'}
                  fontWeight={'700'}
                  lineHeight={'15px'}
                  color={'tomato'}
                  w={'100%'}
                  textAlign={'center'}
                >
                  Where Writing Sparks Fluency
                </Text>
                <Text maxW={'500px'} mt={'10px'} fontSize={'18px'} textAlign={'center'} px={'20px'}>
                  Dive into our writing feature today, and stay tuned for more
                  vibrant updates!
                </Text>
                <VStack align={'flex-start'} px={'20px'}>
                <HStack mt='30px' >
                  <Image
                    src='/pictures/double-check.png'
                    alt='Check'
                    width={'30px'}
                    objectFit={'cover'}
                  />
                  <Text fontSize={'18px'}>
                    Access Diverse Weekly Writing Challenges
                  </Text>
                </HStack>
                <HStack>
                  <Image
                    src='/pictures/double-check.png'
                    alt='Check'
                    width={'30px'}
                    objectFit={'cover'}
                  />
                  <Text fontSize={'18px'}>
                    Get Custom Feedback to Hone Your Skills
                  </Text>
                </HStack>
                <HStack>
                  <Image
                    src='/pictures/double-check.png'
                    alt='Check'
                    width={'30px'}
                    objectFit={'cover'}
                  />
                  <Text fontSize={'18px'}>
                    Improve with AI-Driven Writing Tools
                  </Text>
                </HStack>
                <HStack>
                  <Image
                    src='/pictures/double-check.png'
                    alt='Check'
                    width={'30px'}
                    objectFit={'cover'}
                  />
                  <Text fontSize={'18px'}>
                    See Real Progress with Regular Use
                  </Text>
                </HStack>
                </VStack>
                <Link href={'/app/login'}>
                  <Box
                    bg='#ecc94b'
                    ml={isLargerThan768?'8px':'18px'}
                    mt='30px'
                    width={isLargerThan768?'365px':'300px'}
                    h={'20px'}
                    overflow={'visible'}
                    fontSize={'20px'}
                  ></Box>
                  <Text fontSize={isLargerThan768?'22px':'18px'} fontWeight={'700'} mt='-20px' w={'100%'} textAlign={"center"}>
                    Try it now with our 14-day free trial{' '}
                  </Text>
                </Link>
                <Link href={'/app/login'}>
                  <Text  fontSize={'18px'} fontWeight={'600'} mt='-5px' color={'#cdaf43'}>
                    Or peek into our app first
                  </Text>
                </Link>
              </VStack>
              <VStack>
                <Text
                  as='h3'
                  fontSize={'25px'}
                  fontWeight={'700'}
                  mb='10px'
                  lineHeight={'35px'}
                >
                  Writing plans only
                </Text>
                <HStack ml={isLargerThan768?'50px':0 }spacing={4} align={'center'}>
                  {isLargerThan768&&<VStack
                    w={isLargerThan930?'350px':'300px'}
                    h='430px'
                    bg=' linear-gradient(to left, #2c3e50, #fd746c)'
                    px='10px'
                    py='20px'
                    borderRadius={'10px'}
                    color={'white'}
                  >
                    <Text
                      as='h3'
                      fontSize={'25px'}
                      fontWeight={'700'}
                      lineHeight={'35px'}
                    >
                      All Access
                    </Text>
                    <Text fontSize={'18px'}>$15/month or $150/year</Text>
                    <Box w={isLargerThan930?'250px':"220px"} fontSize={'15px'} mt={'15px'}>
                      <ul>
                        <li>
                          Unlimited access to all writing categories including
                          Creative Writing, Business English, and more.
                        </li>
                        <li>Weekly Themed Challenges across all categories.</li>
                        <li>Personalized feedback on submissions.</li>
                        <li>
                          Access to a vast library of resources for writing
                          improvement.
                        </li>
                        <li>Priority support.</li>
                      </ul>
                    </Box>
                  </VStack>}
                 {isLargerThan768&& <VStack
                    w={isLargerThan930?'350px':'300px'}
                    h='430px'
                    bg='linear-gradient(to left, #0f2027, #203a43, #2c5364)'
                    px='10px'
                    py='20px'
                    borderRadius={'10px'}
                    color={'white'}
                  >
                    <Text
                      as='h3'
                      fontSize={'25px'}
                      fontWeight={'700'}
                      lineHeight={'35px'}
                    >
                      Exam Prep Focus
                    </Text>
                    <Text fontSize={'18px'}>$10/month</Text>
                    <Box w={isLargerThan930?'250px':"220px"} fontSize={'15px'} mt={'15px'}>
                      <ul>
                        <li>
                          Unlimited access to exam preparation categories
                          including IELTS, TOEFL, and Cambridge Assessments.
                        </li>
                        <li>Regularly updated exam-specific challenges.</li>
                        <li>
                          Detailed feedback aimed at boosting exam performance.
                        </li>
                        <li>
                          Access to exam prep resources, tips, and strategies.
                        </li>
                        <li>Standard support.</li>
                      </ul>
                    </Box>
                  </VStack>}
                  {!isLargerThan768&&<Splide
                  style={{ width: '400px'}}
                  options={{
                    type: 'loop',
                    
                  }}
        >
          
          <SplideSlide  style={{ width: '400px'}}>
          <VStack
                    w={isLargerThan930?'350px':'300px'}
                    h='430px'
                    bg=' linear-gradient(to left, #2c3e50, #fd746c)'
                    px='10px'
                    py='20px'
                    borderRadius={'10px'}
                    color={'white'}
                  >
                    <Text
                      as='h3'
                      fontSize={'25px'}
                      fontWeight={'700'}
                      lineHeight={'35px'}
                    >
                      All Access
                    </Text>
                    <Text fontSize={'18px'}>$15/month or $150/year</Text>
                    <Box w={isLargerThan930?'250px':"220px"} fontSize={'15px'} mt={'15px'}>
                      <ul>
                        <li>
                          Unlimited access to all writing categories including
                          Creative Writing, Business English, and more.
                        </li>
                        <li>Weekly Themed Challenges across all categories.</li>
                        <li>Personalized feedback on submissions.</li>
                        <li>
                          Access to a vast library of resources for writing
                          improvement.
                        </li>
                        <li>Priority support.</li>
                      </ul>
                    </Box>
                  </VStack>
</SplideSlide>
<SplideSlide >
<VStack
                    w={isLargerThan930?'350px':'300px'}
                    h='430px'
                    bg='linear-gradient(to left, #0f2027, #203a43, #2c5364)'
                    px='10px'
                    py='20px'
                    borderRadius={'10px'}
                    color={'white'}
                  >
                    <Text
                      as='h3'
                      fontSize={'25px'}
                      fontWeight={'700'}
                      lineHeight={'35px'}
                    >
                      Exam Prep Focus
                    </Text>
                    <Text fontSize={'18px'}>$10/month</Text>
                    <Box w={isLargerThan930?'250px':"220px"} fontSize={'15px'} mt={'15px'}>
                      <ul>
                        <li>
                          Unlimited access to exam preparation categories
                          including IELTS, TOEFL, and Cambridge Assessments.
                        </li>
                        <li>Regularly updated exam-specific challenges.</li>
                        <li>
                          Detailed feedback aimed at boosting exam performance.
                        </li>
                        <li>
                          Access to exam prep resources, tips, and strategies.
                        </li>
                        <li>Standard support.</li>
                      </ul>
                    </Box>
                  </VStack>
                </SplideSlide>
        </Splide>}
                </HStack>
              </VStack>
            </HStack>
          </VStack>
          {/* Contacts. */}
          <VStack
            w={'100%'}
            h='300px'
            bg='#ecc94b'
            mt={'150px'}
            align={'center'}
          >
            <Text
              mt={'20px'}
              fontWeight={'600'}
              fontSize={'60px'}
              color={'white'}
            >
              Contact us
            </Text>
              <Text color={'black'} fontWeight={'400'} textAlign={'center'} maxW={"350px"}>
                Got questions or feedback? We’re all ears! Drop us a line, and
                let's make your language journey unforgettable together.
              </Text>
              <Link href="mailto:tulex.lang@gmail.com?subject=Inquiry&body=Hello, I'm interested in learning more about your services.">
                <Text
                  color='black'
                  textDecor={'underline'}
                  textAlign={'center'}
                  mt={'20px'}
                >
                  tulex.lang@gmail.com
                </Text>
              </Link>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default LandingPage;
