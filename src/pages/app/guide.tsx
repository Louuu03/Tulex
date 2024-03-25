import React, { useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  VStack,
  useMediaQuery,
  Stepper,
  Step,
  StepIndicator,
  StepStatus,
  StepIcon,
  StepNumber,
  Box,
  StepTitle,
  StepSeparator,
  Text,
  CheckboxGroup,
  Stack,
  Checkbox,
  useToast,
  Flex,
} from '@chakra-ui/react';
import InputFile from '@/components/layout/inputfile';
import en from '../../i18n/en.json';
import { useForm, SubmitHandler } from 'react-hook-form';
import axios from 'axios';
import { useRouter } from 'next/router';
import FullPageLoader from '@/components/layout/fullloader';
import { DateTime } from 'luxon';

type ProfileProps = {
  photo: string;
  name: string;
  birthday: string;
  gender: string;
  country: string;
};

interface IFormInput {
  name: string;
  birthday: string;
  gender: string;
  country: string;
  createAt: string;
}

const GuidePage: React.FC = ({}) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [stepIndex, setStepIndex] = useState(0);
  const [language, setLanguage] = useState<(string | number)[]>([]);
  const [isLoading, setIsLoading] = useState<'main' | 'submit' | false>('main');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<IFormInput>();
  const toast = useToast();
  const steps = [{ title: 'Step 1' }, { title: 'Step 2' }, { title: 'Step 3' }];
  const router = useRouter();

  const handleNext = (num: number) => {
    if (num === 3) {
      setIsLoading('submit');
      if (language.length === 0) {
        toast({
          title: 'Please select your language',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
      } else {
        axios
          .put('/api/guide?method=lang', language)
          .then(response => {
            setStepIndex(stepIndex + 1);
            router.push('/app');
            setIsLoading(false);
          })
          .catch(error => {
            toast({
              title: error.message,
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            setIsLoading(false);
          });
      }
    } else {
      setStepIndex(stepIndex + 1);
    }
  };
  const onSubmit: SubmitHandler<IFormInput> = data => {
    setIsLoading('submit');
    let newData=data;
    newData.birthday=DateTime.fromISO(data.birthday + 'T00:00').toString();
    newData.createAt=DateTime.now().toString();;
    axios
      .put('/api/guide?method=basic', newData)
      .then(response => {
        handleNext(1);
        setIsLoading(false);
      })
      .catch(error => {
        toast({
          title: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
      });
  };

  useEffect(() => {
    //check if user exists
    setIsLoading('main');
    axios
      .get('/api/guide')
      .then(response => {
        response.status === 203 && router.push('/app');
        setIsLoading(false);
      })
      .catch(error => {
        toast({
          title: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
        setIsLoading(false);
      });
  }, []);

  return isLoading === 'main' ? (
    <FullPageLoader />
  ) : (
    <VStack align='center' className='guide-container'>
      <VStack
        className={`main-container ${isLargerThan768 ? '' : 'phone'}`}
        marginLeft={isLargerThan768 ? '65px' : 'initial'}
        spacing={0}
        align={'Center'}
        mt={5}
      >
        <Stepper
          index={stepIndex}
          w={isLargerThan768 ? '600px' : '300px'}
          size={isLargerThan768 ? 'lg' : 'sm'}
        >
          {steps.map((step, index) => (
            <Step key={index}>
              <StepIndicator>
                <StepStatus
                  complete={<StepIcon />}
                  incomplete={<StepNumber />}
                  active={<StepNumber />}
                />
              </StepIndicator>

              <Box flexShrink='0'>
                <StepTitle>{step.title}</StepTitle>
              </Box>

              <StepSeparator />
            </Step>
          ))}
        </Stepper>
        {stepIndex === 0 ? (
          <VStack mt={12} width={'100%'} mx={2} align={'center'}>
            <Text mb={4} fontSize='2xl' fontWeight={600} textAlign='center'>
              {' '}
              Basic Information
            </Text>
            {/*  TODO When S3 Set
          <Flex width={'100%'} direction='column' align='center' mb={4}>
            <Avatar size='sm' name={name} src={photo} boxSize={'50px'} />
            <InputFile />
          </Flex> */}
            <form onSubmit={handleSubmit(onSubmit)}>
              <FormControl
                isRequired
                w={'350px'}
                flexDirection={'row'}
                display={'flex'}
                alignItems={'center'}
              >
                <FormLabel textAlign={'center'} w={'100px'}>
                  Name
                </FormLabel>
                <Input
                  isInvalid={!!errors.name}
                  {...register('name', { required: 'Name is required' })}
                  w='200px'
                />
                <Text color='red' fontSize='sm'>
                  {errors.name && errors.name.message}
                </Text>
              </FormControl>

              <FormControl
                mt={4}
                isRequired
                w={'350px'}
                flexDirection={'row'}
                display={'flex'}
                alignItems={'center'}
              >
                <FormLabel textAlign={'center'} w={'100px'}>
                  Birthday
                </FormLabel>
                <Input
                  isInvalid={!!errors.birthday}
                  type='date'
                  {...register('birthday', {
                    required: 'Birthday is required',
                  })}
                  w='200px'
                />
                {errors.birthday && <p>{errors.birthday.message}</p>}
              </FormControl>

              <FormControl
                mt={4}
                isRequired
                w={'350px'}
                flexDirection={'row'}
                display={'flex'}
                alignItems={'center'}
              >
                <FormLabel textAlign={'center'} w={'100px'}>
                  Gender
                </FormLabel>
                <Select
                  isInvalid={!!errors.gender}
                  {...register('gender', {
                    required: 'Please select your gender',
                  })}
                  w='200px'
                  placeholder='Select gender'
                >
                  {/* Assuming `en.options.gender` is accessible */}
                  {en.options.gender.map(gender => (
                    <option key={gender.value} value={gender.value}>
                      {gender.name}
                    </option>
                  ))}
                </Select>
                {errors.gender && <p>{errors.gender.message}</p>}
              </FormControl>

              <FormControl
                mt={4}
                isRequired
                w={'350px'}
                flexDirection={'row'}
                display={'flex'}
                alignItems={'center'}
              >
                <FormLabel textAlign={'center'} w={'100px'}>
                  Country
                </FormLabel>
                <Select
                  isInvalid={!!errors.country}
                  {...register('country', {
                    required: 'Please select your country',
                  })}
                  w='200px'
                  placeholder='Select country'
                >
                  {/* Assuming `en.options.country` is accessible */}
                  {en.options.country.map(country => (
                    <option key={country.value} value={country.value}>
                      {country.name}
                    </option>
                  ))}
                </Select>
                {errors.country && <p>{errors.country.message}</p>}
              </FormControl>
              <Flex justifyContent={'center'} mt={4}>
                {' '}
                <Button
                  type='submit'
                  mx={isLargerThan768 ? 2 : 5}
                  mt={4}
                  bg='#ecc94b'
                  py='2'
                  px='4'
                >
                  Next
                </Button>
              </Flex>
            </form>
          </VStack>
        ) : stepIndex === 1 ? (
          <VStack mt={12} width={'100%'} mx={2} align={'center'}>
            <Text mb={4} fontSize='2xl' fontWeight={600} textAlign='center'>
              {' '}
              Do You Know?
            </Text>
            <Text>
              You can Actually subscribe to the category you want to learn,
            </Text>
            <Text>
              It will automatically sign you up weekly for its new topics.
            </Text>
            <Button
              mx={isLargerThan768 ? 2 : 5}
              mt={4}
              bg='#ecc94b'
              py='2'
              px='4'
              onClick={() => handleNext(2)}
            >
              Next
            </Button>
          </VStack>
        ) : (
          <VStack mt={12} width={'100%'} mx={2} align={'center'}>
            <Text mb={4} fontSize='2xl' fontWeight={600} textAlign='center'>
              {' '}
              Choose Your Learning Language
            </Text>
            <CheckboxGroup
              colorScheme='green'
              onChange={values => {
                setLanguage(values);
              }}
            >
              <Stack direction='column'>
                {en.options.language.map(language => (
                  <Checkbox key={language.value} value={language.value}>
                    {language.name}
                  </Checkbox>
                ))}
              </Stack>
            </CheckboxGroup>
            <Button
              mx={isLargerThan768 ? 2 : 5}
              mt={4}
              bg='#ecc94b'
              py='2'
              px='4'
              onClick={() => handleNext(3)}
            >
              Start!
            </Button>
          </VStack>
        )}
      </VStack>
    </VStack>
  );
};

export default GuidePage;
