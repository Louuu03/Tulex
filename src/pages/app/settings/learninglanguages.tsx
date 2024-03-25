import React, { useEffect, useState } from 'react';
import {
  Button,
  Flex,
  VStack,
  useMediaQuery,
  Avatar,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  CheckboxGroup,
  Stack,
  Checkbox,
  Tabs,
  useToast,
} from '@chakra-ui/react';
import en from '../../../i18n/en.json';
import axios from 'axios';
import { includes, set } from 'lodash';
import FullPageLoader from '@/components/layout/fullloader';

type Item = {
  language: string;
  id: string;
};
interface CheckItems {
  writing: (string | number)[];
  speaking: string[];
}

type EditableChecklistProps = {
  items: Item[];
};

const LearningLanguagesPage: React.FC<EditableChecklistProps> = ({}) => {
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');
  const [isEditing, setIsEditing] = useState(false);
  const [checkedItems, setCheckedItems] = useState<CheckItems>({
    writing: [],
    speaking: [],
  });
  const [isLoading, setIsLoading] = useState<'main' | 'submit' | false>('main');
  const toast = useToast();

  const handleEditClick = () => {
    if (isEditing) {
      if (checkedItems.writing.length === 0) {
        toast({
          title: 'Please select at least one writing language',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } else {
        setIsLoading('submit');
        axios
          .put('/api/settings/language', checkedItems)
          .then(res => {
            toast({
              title: 'Language updated successfully',
              status: 'success',
              duration: 3000,
              isClosable: true,
            });
            setIsEditing(false);
            setIsLoading(false);
          })
          .catch(error => {
            console.log(error);
            toast({
              title: 'Failed to update language',
              status: 'error',
              duration: 3000,
              isClosable: true,
            });
            setIsLoading(false);
          });
      }
    } else {
      setIsEditing(true);
    }
  };

  useEffect(() => {
    setIsLoading('main');
    axios
      .get('/api/settings/language')
      .then(res => {
        const { languages } = res.data;
        setCheckedItems(languages);
        setIsLoading(false);
      })
      .catch(error => {
        console.log(error);
        toast({
          title: 'An unexpected error occurred',
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
    <VStack align='center' className='writing-container'>
      <VStack
        className={`main-container ${isLargerThan768 ? '' : 'phone'}`}
        marginLeft={isLargerThan768 ? '65px' : 'initial'}
        spacing={0}
        align={'flex-start'}
        pt={isLargerThan768 ? '0' : '70px'}
      >
        <Tabs width={'90%'} mx={'20px'} maxW={'600px'}>
          <TabList>
            <Tab>Writing</Tab>
            <Tab>Speaking</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <Flex justifyContent='space-between' mb={4}>
                <CheckboxGroup
                  colorScheme='green'
                  isDisabled={isLoading === 'submit' || !isEditing}
                  defaultValue={checkedItems.writing}
                  onChange={values =>
                    setCheckedItems({ ...checkedItems, writing: values })
                  }
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
                  onClick={handleEditClick}
                  isDisabled={isLoading === 'submit'}
                  bg='#ecc94b'
                  size='sm'
                >
                  {isEditing ? 'Save' : 'Edit'}
                </Button>
              </Flex>
            </TabPanel>
            <TabPanel>
              <Flex>Coming Soon</Flex>
            </TabPanel>
          </TabPanels>
        </Tabs>
      </VStack>
    </VStack>
  );
};

export default LearningLanguagesPage;
