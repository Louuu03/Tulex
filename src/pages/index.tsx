import FullPageLoader from '@/components/layout/fullloader';
import {
  Box,
  Button,
  Center,
  Flex,
  HStack,
  Image,
  Text,
  VStack,
  useBreakpointValue,
  useMediaQuery,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import { useSpring, animated } from 'react-spring';
import Link from 'next/link';

const Navbar = () => {
  const isDesktop = useBreakpointValue({ base: false, lg: true });
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

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
      h={'70px'}
      boxShadow={'1px 1px 2px rgba(0, 0, 0, 0.1)'}
      className='navbar'
      px={isLargerThan768 ? '60px' : '20px'}
    >
      <HStack pb={isLargerThan768 ? '10px' : 0}>
        <Text
          color='#ecc94b'
          fontSize={isLargerThan768 ? '40px' : '35px'}
          fontWeight={isLargerThan768 ? '700' : '600'}
        >
          Tulex
        </Text>
        <Text ml='-8px' fontSize={'40px'} fontWeight={'800'} color={'tomato'}>
          .
        </Text>
      </HStack>
      <Box display={{ base: 'block', md: 'none' }} onClick={() => {}}></Box>

      <Box
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
      </Box>
    </Flex>
  );
};

const LandingPage: React.FC = () => {
  const [isLargerThan930] = useMediaQuery('(min-width: 930px)');
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [scrollY, setScrollY] = useState(0);
  const [show, setShow] = useState(false);

  const handleScroll = () => {
    setScrollY(window.scrollY);

    if (window.scrollY > 70) {
      setShow(true);
    } else {
      setShow(false);
    }
  };
  const calcX = y => -(y / 5); // Adjust movement speed/direction for X
  const calcY = y => -(y / 3); // Adjust movement speed/direction for Y

  const [{ xy }, set] = useSpring(() => ({
    xy: [0, 0],
    config: { mass: 10, tension: 550, friction: 140 },
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
        {/* First Page */}
        <Box h='100vh' bg='#ecc94b' overflow={'hidden'} maxH={'900px'}>
          <HStack
            w={'100%'}
            justify={'space-between'}
            position={'relative'}
            px={isLargerThan930 ? '60px' : '20px'}
            zIndex={100}
          >
            <VStack align={'flex-start'} pt='20px'>
              <HStack>
                <Text
                  as={'h1'}
                  color={'white'}
                  fontSize={'35px'}
                  lineHeight={'25px'}
                  fontWeight={'600'}
                >
                  Tulex
                </Text>
                <Text
                  fontSize={'35px'}
                  lineHeight={'25px'}
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
                fontSize={'30px'}
                lineHeight={'15px'}
                fontWeight={'600'}
              >
                The Ultimate Exchange
              </Text>
            </VStack>
            <HStack spacing={6} pt='30px' fontWeight={'600'} fontSize={'20px'}>
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
            </HStack>
          </HStack>
          <animated.div
            position='relative'
            style={{
              transform: xy.to(
                (x, y) => `translate3d(${x}px,${y}px,0) rotate(-30deg)`
              ),
            }}
            zIndex={100}
          >
            <Image
              src='/pictures/main.png'
              alt='Dynamic Image'
              w='700px'
              position='absolute'
              top='200px'
              right='50px'
              zIndex={100}
            />
          </animated.div>
          <Box className='Pattern' position={'relative'} zIndex={1} w='100%'>
            <Box
              width='150px'
              height='1200px'
              bg='black'
              transform='rotate(-30deg)'
              position={'absolute'}
              top='-200px'
              right={'50px'}
              zIndex={1}
            ></Box>
            <Box
              width='170px'
              height='1500px'
              bg='black'
              transform='rotate(60deg)'
              position={'absolute'}
              top='100px'
              right={'700px'}
              zIndex={1}
            ></Box>
          </Box>
          <VStack
            mt='230px'
            align={'flex-start'}
            fontWeight={'800'}
            pl='100px'
            position={'relative'}
            zIndex={100}
          >
            <Text
              as='h2'
              fontSize='70px'
              color='white'
              lineHeight={''}
              zIndex={100}
            >
              Slide to Fluency{' '}
            </Text>
            <Text
              as='h3'
              fontSize={isLargerThan930 ? '50px' : '40px'}
              width='50%'
              color='black'
              zIndex={100}
            >
              Where Languages Flow Smoothly
            </Text>
            <Box
              width='100px'
              height='100px'
              bg='tomato'
              transform='rotate(30deg)'
              position={'absolute'}
              top='10px'
              left={'60px'}
              zIndex={1}
            ></Box>
          </VStack>
        </Box>

        <VStack>
          {/* App description */}
          <HStack mt='150px' width={'70%'} justify={'space-between'}>
            <Box>
              <Text as='h3' fontSize={'40px'} fontWeight={'700'}>
                Lost in Language Land?{' '}
              </Text>
              <Text
                as='h3'
                fontSize={'30px'}
                fontWeight={'700'}
                color={'tomato'}
              >
                Let Tulex Be Your Guide:{' '}
              </Text>
              <Text
                as='h3'
                fontSize={'30px'}
                fontWeight={'700'}
                color={'tomato'}
              >
                Where Every Word’s a Win.{' '}
              </Text>
              <Text maxW={'500px'} mt={'10px'} fontSize={'18px'}>
                Feeling adrift in solo study sessions? Ditch the dull drills for
                Tulex’s lively lanes of language learning. We mix humor with
                guidance, ensuring your journey through speaking and writing is
                peppered with chuckles and insights. With fresh weekly themes to
                spark your creativity, Tulex isn’t just about mastering
                languages; it’s about adding flavor to every phrase. Get ready
                for a learning ride that’s as entertaining as it is educational!
              </Text>
            </Box>
            <HStack>
              <Image
                src='/pictures/Guide2.jpg'
                alt='Guide'
                width={'250px'}
                h={'350px'}
                objectFit={'cover'}
              />
              <Image
                src='/pictures/Guide1.jpg'
                alt='Guide'
                width={'250px'}
                h={'350px'}
                objectFit={'cover'}
                
              />
            </HStack>
            <Box id='writing'></Box>
          </HStack>
          {/* Writing */}
          <VStack
            mt='250px'
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
              >
                Why Writing?
              </Text>
            </VStack>

            <Text fontSize={'18px'}>
              Diving into language learning through writing is like texting a
              crush—it makes you think before you hit send. This method forces
              you to slow down, flirt with words, and really get the grammar to
              wink back at you. It's practical magic: boosting memory, making
              sense of those pesky verb tenses, and turning vocab flirtations
              into full-blown love stories. Plus, you get to see your progress,
              like snapshots of your growing linguistic charm. In short, writing
              not only sharpens your skills but also turns you into a
              smooth-talking grammar guru.
            </Text>
          </VStack>
          <HStack mt='50px' width={'70%'} justify={'space-between'}>
            <VStack width='47%' justify={'center'}>
              <Text as='h4' fontSize={'30px'} fontWeight={'600'} mb={'20px'}>
                Themed Writing Challenges
              </Text>
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
                  <Text
                    width={'80%'}
                    color={'white'}
                    fontSize={'18px'}
                    fontWeight={'500'}
                  >
                    Jumpstart your creativity and language skills with Tulex's
                    Themed Writing Challenges. From Grammar Focus to IELTS Prep,
                    our weekly creative prompts not only keep your learning
                    fresh but also directly cater to your learning goals. It's
                    about pushing your boundaries and discovering the joy in
                    expressing complex ideas with simplicity and clarity.
                  </Text>
                </Center>
              </Box>
            </VStack>

            <VStack width='47%' justify={'center'}>
              <Text as='h4' fontSize={'30px'} fontWeight={'600'} mb={'20px'}>
                Personalized Feedback
              </Text>

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
                  <Text
                    width={'80%'}
                    color={'white'}
                    fontSize={'18px'}
                    fontWeight={'500'}
                  >
                    Imagine having a mentor who not only reads your work but
                    provides detailed, constructive feedback to help you grow.
                    Tulex's feedback mechanism focuses on improvement,
                    celebrating your strengths while gently guiding you on areas
                    to enhance. It's like having a personal coach, but for your
                    writing skills.
                  </Text>
                </Center>
              </Box>
            </VStack>
          </HStack>
          <Box id='speaking'></Box>
          {/* Speaking */}
          <Box
            mt={'200px'}
            position={'relative'}
            width={'100%'}
            height={'800px'}
          >
            <Image
              src='/pictures/map.jpg'
              alt='Speaking'
              position={'relative'}
              width={'100vw'}
              opacity={0.15}
              height={'800px'}
              objectFit={'cover'}
              zIndex={80}
            />
            <VStack
              position={'absolute'}
              top={10}
              left={10}
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
                We turn language practice into a fun-filled gathering. No need
                to fret over running out of topics or navigating conversations;
                we've got you covered with a treasure trove of materials. From
                handy conversation starters to common language structures, we
                prep you to dive into exchanges with confidence. It's like
                having a guidebook for the most exciting language adventure.
                With Tulex, every chat is an opportunity to learn, laugh, and
                leap towards fluency, ensuring you're always ready to keep the
                conversation flowing.
              </Text>
              <HStack mt={'60px'} width={'70%'} justify={'space-between'}>
                <VStack w={'33%'} padding={'10px'}>
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
                  <Text fontSize={'25px'} fontWeight={'600'}>
                    1. Choose an event
                  </Text>
                  <Text
                    py={'10px'}
                    px={'20px'}
                    fontSize={'18px'}
                    bg={'white'}
                    borderRadius={'10px'}
                    h='220px'
                  >
                    Choose your adventure by selecting a speaking event that
                    tickles your fancy from our vibrant calendar. It’s like
                    picking the perfect date, but for your brain.
                  </Text>
                </VStack>
                <VStack w={'33%'} padding={'10px'}>
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
                  <Text fontSize={'25px'} fontWeight={'600'}>
                    2. Prep with Our Materials
                  </Text>
                  <Text
                    py={'10px'}
                    px={'20px'}
                    fontSize={'18px'}
                    bg={'white'}
                    borderRadius={'10px'}
                    h='220px'
                  >
                    Arm yourself with our specially curated materials, filled
                    with conversation starters and language(sentence)
                    structures. Think of it as suiting up in linguistic armor
                    before the battle of banter.
                  </Text>
                </VStack>
                <VStack w={'33%'} padding={'10px'}>
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
                  <Text fontSize={'25px'} fontWeight={'600'}>
                    3. Dive into the Digital Soiree
                  </Text>
                  <Text
                    py={'10px'}
                    px={'20px'}
                    fontSize={'18px'}
                    bg={'white'}
                    borderRadius={'10px'}
                    h='220px'
                  >
                    This isn't just another video call; our speaking events come
                    alive in a virtual space designed to mimic an in-person
                    language exchange. Picture yourself wandering through a
                    digital party, mingling and chatting just like you would in
                    the real world.
                  </Text>
                </VStack>
              </HStack>
            </VStack>
          </Box>
          <Box id='plans'></Box>
          {/* Pricing */}
          <VStack mt='100px' width={'70%'} justify={'space-between'}>
            <Text as='h4' fontSize={'40px'} fontWeight={'600'} mb={'20px'}>
              Our Plan
            </Text>
            <HStack width='47%' justify={'center'}>
              <VStack align={'flex-start'} maxW={'400px'}>
                <Text
                  as='h3'
                  fontSize={'35px'}
                  fontWeight={'700'}
                  lineHeight={'35px'}
                >
                  Unleash Your Words with Tulex
                </Text>
                <Text
                  as='h3'
                  fontSize={'25px'}
                  fontWeight={'700'}
                  lineHeight={'15px'}
                  color={'tomato'}
                >
                  Where Writing Sparks Fluency{' '}
                </Text>
                <Text maxW={'500px'} mt={'10px'} fontSize={'18px'}>
                  Dive into our writing feature today, and stay tuned for more
                  vibrant updates!
                </Text>
                <HStack mt='30px'>
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
                <Link href={'/app/login'}>
                  <Box
                    bg='#ecc94b'
                    ml='10px'
                    mt='30px'
                    width='370px'
                    h={'20px'}
                    overflow={'visible'}
                    fontSize={'20px'}
                  ></Box>
                  <Text fontSize={'22px'} fontWeight={'700'} mt='-20px'>
                    Try it now with our 14-day free trial{' '}
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
                <HStack ml='50px' spacing={4}>
                  <VStack
                    w={'350px'}
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
                    <Box w={'250px'} fontSize={'15px'} mt={'15px'}>
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
                  <VStack
                    w={'350px'}
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
                    <Box w={'250px'} fontSize={'15px'} mt={'15px'}>
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
                  </VStack>{' '}
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
            <Text fontSize={'20px'} width={'400px'}>
              <Text color={'black'} fontWeight={'400'} textAlign={'center'}>
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
            </Text>
          </VStack>
        </VStack>
      </Box>
    </Box>
  );
};

export default LandingPage;
