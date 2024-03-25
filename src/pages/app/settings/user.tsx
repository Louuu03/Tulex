import React, { use, useEffect, useState } from 'react';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Select,
  Flex,
  Text,
  VStack,
  useMediaQuery,
  Avatar,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { DateTime } from 'luxon';
import en from '../../../i18n/en.json';
import { find, set } from 'lodash';
import { useForm } from 'react-hook-form';
import FullPageLoader from '@/components/layout/fullloader';

type Profile = {
  img: string;
  name: string;
  birthday: string;
  gender: string;
  country: string;
};

const UserPage: React.FC = () => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isLoading, setIsLoading] = useState<'main' | 'update' | false>('main');
  const [isEditing, setEditing] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<Profile>();
  const toast = useToast();

  const onSubmit = (data: Profile) => {
    setIsLoading('update');
    let userData = data;
    userData.img = '';
    userData.birthday=DateTime.fromISO(userData.birthday + 'T00:00').toString();
    !isEditing
      ? setEditing(true)
      : axios
          .put('/api/settings/user', userData)
          .then(response => {
            toast({
              title: 'User updated successfully',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            setEditing(false);
            setIsLoading(false);
          })
          .catch(error => {
            console.log(error);
            toast({
              title: 'Failed to update user',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            setEditing(false);
            setIsLoading(false);
          });
  };

  useEffect(() => {
    setIsLoading('main');
    axios
      .get('/api/settings/user')
      .then(response => {
        const { img, name, birthday, gender, country } = response.data.user;
        setValue('img', img);
        setValue('name', name);
        setValue('birthday', DateTime.fromISO(birthday).toFormat('yyyy-MM-dd'));
        setValue('gender', gender);
        setValue('country', country);
        setIsLoading(false);
      })
      .catch(error => {
        setIsLoading(false);
        toast({
          title: 'An unexpected error occurred',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  }, []);

  return isLoading === 'main' ? (
    <FullPageLoader />
  ) : (
    <VStack align='center' className='userpage-container'>
      <VStack
        className={`main-container ${isLargerThan768 ? '' : 'phone'}`}
        marginLeft={isLargerThan768 ? '65px' : 'initial'}
        spacing={0}
        align={'flex-start'}
      >
        <form onSubmit={handleSubmit(onSubmit)}>
          <VStack mt={8} width={'100%'} mx={isLargerThan768 ? 2 : 6}>
            <Flex width={'100%'} direction='column' align='left' mb={4}>
              <Avatar size='sm' name={watch('name')} src={watch('img')} />
              {/* TODO <InputFile /> */}
            </Flex>
            <FormControl id='name' isRequired>
              <FormLabel>Name</FormLabel>
              {isEditing ? (
                <Input
                  defaultValue={watch('name')}
                  {...register('name', { required: true, minLength: 3 })}
                  name='name'
                  w='200px'
                />
              ) : (
                <Text>{watch('name')}</Text>
              )}
              {errors.name && (
                <Text color='red.500'>Required, min 2 characters</Text>
              )}
            </FormControl>
            <FormControl id='birthday' mt={4} isRequired>
              <FormLabel>Birthday</FormLabel>
              {isEditing ? (
                <Input
                  type='date'
                  {...register('birthday', { required: true })}
                  defaultValue={watch('birthday')}
                  name='birthday'
                  w='200px'
                  max='2018-12-31'
                />
              ) : (
                <Text>{watch('birthday').replace(/-/g, '/')}</Text>
              )}
              {errors.birthday && <Text color='red.500'>Required</Text>}
            </FormControl>
            <FormControl id='gender' mt={4} isRequired>
              <FormLabel>Gender</FormLabel>
              {isEditing ? (
                <Select
                  {...register('gender', { required: true })}
                  defaultValue={watch('gender')}
                  name='gender'
                  w='200px'
                >
                  {en.options.gender.map(gender => (
                    <option key={gender.value} value={gender.value}>
                      {gender.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <Text>{en.options.gender[watch('gender')].name}</Text>
              )}
              {errors.gender && <Text color='red.500'>Required</Text>}
            </FormControl>
            <FormControl id='country' mt={4} isRequired>
              <FormLabel>Country</FormLabel>
              {isEditing ? (
                <Select
                  defaultValue={watch('country')}
                  {...register('country', { required: true })}
                  name='country'
                  w='200px'
                >
                  {en.options.country.map(country => (
                    <option key={country.value} value={country.value}>
                      {country.name}
                    </option>
                  ))}
                </Select>
              ) : (
                <Text>
                  {find(en.options.country, { value: watch('country') })?.name}
                </Text>
              )}
              {errors.country && <Text color='red.500'>Required</Text>}
            </FormControl>
          </VStack>

          <Button
            mx={isLargerThan768 ? 2 : 5}
            mt={4}
            bg='#ecc94b'
            type='submit'
            disabled={isLoading === 'update'}
          >
            {isEditing ? 'Save' : 'Edit'}
          </Button>
        </form>
      </VStack>
    </VStack>
  );
};

export default UserPage;
