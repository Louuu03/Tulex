import FiltersComponent from '@/components/layout/filter';
import {
  Button,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Box,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Select,
  useToast,
  IconButton,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  CheckboxGroup,
  Stack,
  Checkbox,
} from '@chakra-ui/react';
import { isEmpty, isString, set } from 'lodash';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';
import en from '../../../i18n/en.json';
import axios from 'axios';
import { DateTime } from 'luxon';
import { Category, Topic } from '@/utils/common-type';

interface CategoryFormProps {
  categoryData: Category;
  setCategoryData: React.Dispatch<React.SetStateAction<Category>>;  
}
const initialCategoryData: Category|any = {
  name: '',
  short: '',
  long: '',
  status: 0,
  language: [],
  create_time: DateTime.now().toFormat('yyyy-MM-dd'),
};

const initialTopicData: Topic |any = {
  name: '',
  create_time: DateTime.now().toFormat('yyyy-MM-dd'),
  description: '',
  endtime: DateTime.now().toFormat('yyyy-MM-dd'),
  steps: [{ name: '', details: '' }],
  category_id: '',
  category_name: '',
  example: '',
  language: 0,
  level: 0,
};

interface TopicFormProps {
  topicData: Topic;
  setTopicData: React.Dispatch<React.SetStateAction<Topic>>;
}

const CategoryForm: React.FC<CategoryFormProps | any> = ({
  categoryData,
  onClose,
  isCategoryOpen,
  setAllData,
  setDeleteData,
  setNewData,
}) => {
  const [data, setData] = useState<Category>(categoryData);
  const [isDelete, setIsDelete] = useState<boolean>(false);
  const toast = useToast();
  const lang:string[] = [];
  data.language.forEach(l => {
    lang.push(en.abbLang[l]?.name);
  });
  const onSubmit = () => {
    let newData = { ...data };
    newData.create_time = DateTime.fromISO(
      newData.create_time + 'T00:00'
    ).toString();
    if (data._id) {
      axios
        .put('/api/admin/writing/category?categoryId=' + data._id, newData)
        .then(res => {
          toast({
            title: 'Category updated successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setAllData(data);
          onClose();
        })
        .catch(err => {
          toast({
            title: err?.response?.data?.message || err.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        });
    } else {
      axios
        .post('/api/admin/writing/category', newData)
        .then(res => {
          toast({
            title: 'Category added successfully',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          setNewData({ ...data, _id: res.data.id });
          onClose();
        })
        .catch(err => {
          console.log(err);
          toast({
            title: err?.response?.data?.message || err.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };
  const onDelete = () => {
    axios
      .delete('/api/admin/writing/category?categoryId=' + data._id)
      .then(res => {
        toast({
          title: 'Category deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsDelete(false);
        setDeleteData(data);
        onClose();
      })
      .catch(err => {
        toast({
          title: err?.response?.data?.message || err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  return (
    <Box p={4}>
      <FormControl isRequired mb={4}>
        <FormLabel htmlFor='name'>Name</FormLabel>
        <Input
          id='name'
          name='name'
          value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Create Time</FormLabel>
        <Input
          type='date'
          name='create_time'
          defaultValue={data.create_time as unknown as string}
          onChange={e => setData({ ...data, create_time: e.target.value as unknown as Date })}
        />
      </FormControl>
      <FormControl isRequired mb={4}>
        <FormLabel htmlFor='short'>Short Description</FormLabel>
        <Textarea
          id='short'
          name='short'
          value={data.short}
          onChange={e => setData({ ...data, short: e.target.value })}
        />
      </FormControl>
      <FormControl isRequired mb={4}>
        <FormLabel htmlFor='long'>Long Description</FormLabel>
        <Textarea
          id='long'
          name='long'
          value={data.long}
          onChange={e => setData({ ...data, long: e.target.value })}
        />
      </FormControl>
      <FormControl isRequired mb={4}>
        <FormLabel htmlFor='status'>Status</FormLabel>
        <Select
          id='status'
          name='status'
          value={data.status}
          onChange={e => {
            setData({ ...data, status: e.target.value as unknown as number });
          }}
        >
          {en.status.map(status => (
            <option key={status.value} value={status.value}>
              {status.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl isRequired mb={4}>
        <FormLabel htmlFor='language'>Language</FormLabel>
        <CheckboxGroup
          colorScheme='green'
          defaultValue={data.language}
          onChange={e => {
            setData({ ...data, language: e as unknown as string[] });
          }}
        >
          <Stack direction='column'>
            {en.options.language.map(language => (
              <Checkbox
                key={language.value}
                value={language.value}
                isChecked={data.language.includes(language.value)}
              >
                {language.name}
              </Checkbox>
            ))}
          </Stack>
        </CheckboxGroup>
      </FormControl>
      <HStack>
        <Button colorScheme='blue' mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button variant='ghost' onClick={() => onSubmit()}>
          {isCategoryOpen === 'Add' ? 'Add' : 'Update'}
        </Button>
        {data._id && (
          <Button variant='ghost' onClick={() => setIsDelete(!isDelete)}>
            {isDelete ? 'Cancel' : 'Delete'}
          </Button>
        )}
        {isDelete && (
          <Button variant='ghost' onClick={() => onDelete()}>
            Really Delete
          </Button>
        )}
      </HStack>
    </Box>
  );
};
const TopicForm: React.FC<TopicFormProps|any> = ({
  categoryData,
  topicData,
  onClose,
  isTopicOpen,
  setAllData,
  setDeleteData,
  setNewData,
}) => {
  const toast = useToast();
  const [data, setData] = useState<Topic|any>(topicData);
  const [categoryValue, setCategoryValue] = useState<
    { name: string; id: string }[]
  >([]);
  const [langOption, setLangOption] = useState<
    { name: string; value: number }[]|any
  >([]);
  const [isDelete, setIsDelete] = useState<boolean>(false);

  const handleSteps = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    index?: number,
    field?: string
  ) => {
    const { value } = e.target;
    if (typeof index === 'number' && field) {
      const newSteps = [...data.steps];
      newSteps[index] = { ...newSteps[index], [field]: value };
      setData({ ...data, steps: newSteps });
    }
  };
  const handleAddStep = () => {
    const newSteps = [...data.steps, { name: '', details: '' }];
    setData({ ...data, steps: newSteps });
  };
  const handleRemoveStep = (index: number) => {
    const newSteps = [...data.steps];
    if (newSteps.length > 1) {
      newSteps.splice(index, 1);
      setData({ ...data, steps: newSteps });
    } else {
      toast({
        title: 'Cannot remove step',
        description: 'At least one step is required.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };
  const changeCategory = v => {
    let newOptions:{name:string, value:string}[] = [];
    let categoryName;
    categoryData.map(category => {
      category._id === v && (categoryName = category.name);
      category._id === v &&
        category.language.forEach(l => {
          newOptions.push({ name: en.options.language[l].name, value: l as string });
        });
    });
    setLangOption(newOptions);
    setData({
      ...data,
      language: newOptions[0].value,
      category_id: v,
      category_name: categoryName,
    });
  };
  const onDelete = () => {
    axios
      .delete('/api/admin/writing/topic?topicId=' + data._id, data)
      .then(res => {
        toast({
          title: 'Topic deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        setIsDelete(false);
        setDeleteData(data);
        onClose();
      })
      .catch(err => {
        toast({
          title: 'An unexpected error occurred',
          description: err?.response?.data?.message || err.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      });
  };

  const onSubmit = () => {
    let newData = { ...data };
    newData.example.length > 0 &&
      (newData.example = newData.example.split('\n'));
    newData.create_time = DateTime.fromISO(
      newData.create_time + 'T00:00'
    ).toString();
    newData.endtime = DateTime.fromISO(newData.endtime + 'T00:00').toString();
    if (data._id) {
      axios
        .put('/api/admin/writing/topic?topicId=' + data._id, newData)
        .then(res => {
          toast({
            title: 'Successfull updated',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          newData.create_time = DateTime.fromISO(newData.create_time)
            .toLocal()
            .toFormat('yyyy-MM-dd');
          newData.endtime = DateTime.fromISO(newData.endtime)
            .toLocal()
            .toFormat('yyyy-MM-dd');
          setAllData(newData);
          onClose();
        })
        .catch(err => {
          toast({
            title: 'An unexpected error occurred',
            description: err?.response?.data?.message || err.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        });
    } else {
      axios
        .post('/api/admin/writing/topic', newData)
        .then(res => {
          toast({
            title: 'Successful added',
            status: 'success',
            duration: 3000,
            isClosable: true,
          });
          newData._id = res.data.id;
          newData.create_time = DateTime.fromISO(newData.create_time)
            .toLocal()
            .toFormat('yyyy-MM-dd');
          newData.endtime = DateTime.fromISO(newData.endtime)
            .toLocal()
            .toFormat('yyyy-MM-dd');
          setNewData(newData);
          onClose();
        })
        .catch(err => {
          toast({
            title: 'An unexpected error occurred',
            description: err?.response?.data?.message || err.message,
            status: 'error',
            duration: 3000,
            isClosable: true,
          });
        });
    }
  };

  useEffect(() => {
    let newOptions:{name:string, value:string}[] = [];
    let categoryOptions: {name:string, id:string}[] = [];
    categoryData[0].language.forEach(l => {
      newOptions.push({ name: en.options.language[l].name, value: l as string });
    });
    categoryData.map(category => {
      categoryOptions.push({ name: category.name, id: category._id });
    });
    setLangOption(newOptions);
    setCategoryValue(categoryOptions);
    setData({
      ...topicData,
      category_id: categoryData[0]._id,
      category_name: categoryData[0].name,
      language: newOptions[0].value,
      example:
        !isString(topicData.example) && topicData?.example.length > 0
          ? topicData.example.join('\n')
          : topicData.example,
    });
  }, []);

  return (
    <VStack spacing={4} align='flex-start'>
      <FormControl>
        <FormLabel>Name</FormLabel>
        <Input
          name='name'
          value={data.name}
          onChange={e => setData({ ...data, name: e.target.value })}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Category</FormLabel>
        <Select
          name='category'
          value={data.category_id}
          onChange={e => {
            changeCategory(e.target.value);
          }}
        >
          {categoryValue.map(category => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Language</FormLabel>
        <Select
          name='language'
          value={data.language}
          onChange={e => {
            setData({ ...data, language: e.target.value });
          }}
        >
          {langOption.map(language => (
            <option key={language.value} value={language.value}>
              {language.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Level</FormLabel>

        <Select
          name='level'
          value={data.level}
          onChange={e => {
            setData({ ...data, level: e.target.value });
          }}
        >
          {en.Level.map(level => (
            <option key={level.value} value={level.value}>
              {level.name}
            </option>
          ))}
        </Select>
      </FormControl>
      <FormControl>
        <FormLabel>Create Time</FormLabel>
        <Input
          type='date'
          name='create_time'
          value={data.create_time}
          onChange={e => {
            setData({ ...data, create_time: e.target.value });
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>End Time</FormLabel>
        <Input
          type='date'
          name='endtime'
          value={data.endtime}
          onChange={e => {
            setData({ ...data, endtime: e.target.value });
          }}
        />
      </FormControl>
      <FormControl>
        <FormLabel>Description</FormLabel>
        <Textarea
          name='description'
          value={data.description}
          onChange={e => {
            setData({ ...data, description: e.target.value });
          }}
        />
      </FormControl>
      {data.steps.map((step, index) => (
        <HStack key={index} spacing={4} align='flex-Start' w={'100%'}>
          <FormControl maxW={'250px'} w={'30%'}>
            <FormLabel>Step Name {index + 1}</FormLabel>

            <Textarea
              name={`stepName-${index}`}
              value={step.name}
              rows={2}
              onChange={e => handleSteps(e, index, 'name')}
            />
          </FormControl>
          <FormControl>
            <FormLabel>Details</FormLabel>
            <Textarea
              name={`stepDetails-${index}`}
              rows={2}
              value={step.details}
              onChange={e => handleSteps(e, index, 'details')}
            />
          </FormControl>
          <IconButton
            mt='32px'
            aria-label='Remove step'
            icon={<AiOutlineMinus />}
            onClick={() => handleRemoveStep(index)}
          />
        </HStack>
      ))}
      <Button leftIcon={<AiOutlinePlus />} onClick={handleAddStep}>
        Add Step
      </Button>
      <FormControl>
        <FormLabel>Example</FormLabel>
        <Textarea
          name='example'
          value={data.example}
          onChange={e => {
            setData({ ...data, example: e.target.value });
          }}
        />
      </FormControl>
      <HStack>
        <Button colorScheme='blue' mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button variant='ghost' onClick={onSubmit}>
          {isTopicOpen === 'Add' ? 'Add' : 'Update'}
        </Button>
        {data._id && (
          <Button variant='ghost' onClick={() => setIsDelete(!isDelete)}>
            {isDelete ? 'Cancel' : 'Delete'}
          </Button>
        )}
        {isDelete && (
          <Button variant='ghost' onClick={() => onDelete()}>
            Really Delete
          </Button>
        )}
      </HStack>
    </VStack>
  );
};

const CategoryPage: React.FC<any> = ({ categoryData, setIsOpen, setData }) => {
  return (
    <Accordion allowToggle={true} w={'100%'}>
      {categoryData.map((category, idx) => {
        let lang:string[] = [];
        category.language.forEach(l => {
          lang.push(en.abbLang[l].name);
        });
        return (
          <AccordionItem key={'category' + idx}>
            <h2>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  {category.name}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text fontWeight='bold' fontSize={'16px'}>
                Create time
              </Text>
              <Text>{category.create_time.replace(/-/g, '/')}</Text>
              <Text fontWeight='bold' fontSize={'16px'}>
                Short
              </Text>
              <Text>{category.short}</Text>
              <Text fontWeight='bold' fontSize={'16px'}>
                long
              </Text>
              <Text>{category.long}</Text>
              <Text fontWeight='bold' fontSize={'16px'}>
                Topics Amount
              </Text>
              <Text>{category?.topics?.length || 0}</Text>
              <Text fontWeight='bold' fontSize={'16px'}>
                Status
              </Text>
              <Text>{en.status[category.status].name}</Text>
              <Text fontWeight='bold' fontSize={'16px'}>
                Subscribed Amount
              </Text>
              <Text>{category?.subscribed?.length || 0}</Text>
              <Text fontWeight='bold' fontSize={'16px'}>
                Language
              </Text>
              <Text>{lang.join(', ')}</Text>
              <Button
                mt='10px'
                onClick={() => {
                  setIsOpen('Edit');
                  setData(category);
                }}
              >
                Edit
              </Button>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

const TopicPage: React.FC<any> = ({ topicData, setIsOpen, setData }) => {
  return (
    <Accordion allowToggle={true} w={'100%'}>
      {topicData.map((topic, idx) => {
        return (
          <AccordionItem key={'topic' + idx}>
            <h2>
              <AccordionButton>
                <Box as='span' flex='1' textAlign='left'>
                  <Text display={'inline'}>{topic.name}</Text>
                  {new Date(topic.create_time) > new Date() && (
                    <Text display={'inline'} color='#cdaf43'>
                      {' '}
                      Not yet published
                    </Text>
                  )}
                </Box>
                <AccordionIcon />
              </AccordionButton>
            </h2>
            <AccordionPanel pb={4}>
              <Text fontWeight='bold' fontSize={'16px'}>
                Category name
              </Text>
              {topic?.category_name}
              <Text fontWeight='bold' fontSize={'16px'}>
                Language
              </Text>
              <Text>{en.options.language[topic?.language]?.name}</Text>
              <Text fontWeight='bold' fontSize={'16px'}>
                Level
              </Text>
              <Text>{en.Level[topic?.level]?.name}</Text>
              <Text fontWeight='bold' fontSize={'16px'}>
                Create time
              </Text>
              <Text>{topic.create_time.replace(/-/g, '/')}</Text>
              <Text fontWeight='bold' fontSize={'16px'}>
                End time
              </Text>
              <Text>{topic.endtime.replace(/-/g, '/')}</Text>
              <Text fontWeight='bold' fontSize={'16px'}>
                Description
              </Text>
              <Text>{topic.description}</Text>
              <Text fontWeight='bold' fontSize={'16px'}>
                Steps
              </Text>
              {topic?.steps?.map((step, idx) => {
                return (
                  <Box pl={2} key={'steps' + idx}>
                    <Text fontWeight={'600'}>{step.name}</Text>
                    <Text pl='10px'>{step.details}</Text>
                  </Box>
                );
              })}
              <Text fontWeight='bold' fontSize={'16px'}>
                Example
              </Text>
              {topic?.example.length > 1 ? (
                topic?.example.map((ex, idx) => (
                  <Text key={'ex' + idx}>{ex}</Text>
                ))
              ) : (
                <Text>{topic?.example}</Text>
              )}
              <Text fontWeight='bold' fontSize={'16px'}>
                Subscribed Amount
              </Text>
              <Text>{topic?.subscribed?.length || 0}</Text>
              <Button
                mt='10px'
                onClick={() => {
                  setIsOpen('Edit');
                  setData(topic);
                }}
              >
                Edit
              </Button>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

const AdminWritingPage: React.FC = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState<
    false | 'AI' | 'Add' | 'Edit'
  >(false);
  const [isTopicOpen, setIsTopicOpen] = useState<false | 'AI' | 'Add' | 'Edit'>(
    false
  );
  const [categoryData, setCategoryData] = useState<Category[] | any>(null);
  const [topicData, setTopicData] = useState<Topic[] | any>(null);
  const [openData, setOpenData] = useState<Category | Topic | null>(
    null
  );
  const [originalData, setOriginalData] = useState<{
    topics: Topic[] | null;
    categories: Category[] | null;
  }|null>(null);

  const router = useRouter();

  const setAllData = (value: Category | Topic, type, mode) => {
    if (mode !== 'delete') {
      const newData = (type === 'category' ? categoryData : topicData)?.map(
        item => {
          if (item._id === value._id) {
            // Found the matching object, return a new object with the updated name
            return value;
          }
          // Not the object we're looking for, return it unchanged
          return item;
        }
      )||[];
      mode === 'add' && newData.push(value);
      type === 'category' ? setCategoryData(newData) : setTopicData(newData);
    } else {
      let newData:any[] = [];
      (type === 'category' ? categoryData : topicData)?.map(item => {
        if (item._id !== value._id) {
          return newData.push(item);
        }
        // Not the object we're looking for, return it unchanged
        return;
      });
      type === 'category' ? setCategoryData(newData) : setTopicData(newData);
    }
  };

  const onClose = () => {
    setIsCategoryOpen(false);
    setIsTopicOpen(false);
    setOpenData(null);
  };

  useEffect(() => {
    let Datas:{categories:Category[], topics:Topic[]}|any = {};
    axios
      .get('/api/admin/writing/category')
      .then(res => {
        let newData = res.data.map(item => {
          item.create_time = DateTime.fromISO(item.create_time)
            .toLocal()
            .toFormat('yyyy-MM-dd');
          return item;
        });
        Datas.categories = newData;
        setCategoryData(newData);
      })
      .catch(err => {
        console.log(err);
      });
    axios
      .get('/api/admin/writing/topic')
      .then(res => {
        let newData = res.data.map(item => {
          item.create_time = DateTime.fromISO(item.create_time)
            .toLocal()
            .toFormat('yyyy-MM-dd');
          item.endtime = DateTime.fromISO(item.endtime)
            .toLocal()
            .toFormat('yyyy-MM-dd');
          return item;
        });
        Datas.topics = newData;
        setTopicData(newData);
      })
      .catch(err => {
        console.log(err);
      });
    setOriginalData(Datas);
  }, []);

  return (
    originalData && (
      <VStack align='center' width={'100%'} px={'20px'}>
        <HStack>
          <Button mt={5} onClick={() => router.push('/app/admin/speaking')}>
            To Speaking
          </Button>
          <Button mt={5} onClick={() => router.push('/app/admin/news')}>
            To News
          </Button>
        </HStack>
        <Tabs width={'100%'} mx={'20px'}>
          <TabList>
            <Tab>Category</Tab>
            <Tab>Topics</Tab>
          </TabList>
          <TabPanels>
            <TabPanel>
              <VStack justifyContent='space-between' mb={4} w={'100%'}>
                <HStack justify={'space-between'} w={'100%'}>
                  <FiltersComponent
                    type={'category'}
                    data={originalData.categories}
                    setData={v => setCategoryData(v)}
                    visibleFilters={[ 'status', 'language']}
                  />
                  <HStack>
                    <Button
                      onClick={() => {
                        setIsCategoryOpen('Add');
                        setOpenData(initialCategoryData);
                      }}
                    >
                      Add Category
                    </Button>
                    <Button onClick={() => setIsCategoryOpen('AI')}>
                      Add With AI
                    </Button>
                  </HStack>
                </HStack>
                {categoryData && (
                  <CategoryPage
                    categoryData={categoryData}
                    setIsOpen={setIsCategoryOpen}
                    setData={setOpenData}
                  />
                )}
              </VStack>
            </TabPanel>
            <TabPanel>
              <VStack justifyContent='space-between' mb={4} w={'100%'}>
                <HStack justify={'space-between'} w={'100%'}>
                  <FiltersComponent
                    type={'topic'}
                    data={originalData.topics}
                    setData={v => setTopicData(v as unknown as Topic[])}
                    visibleFilters={['status', 'level', 'language', 'sort']}
                  />
                  <HStack>
                    <Button
                      onClick={() => {
                        setIsTopicOpen('Add');
                        setOpenData(initialTopicData);
                      }}
                    >
                      Add Topic
                    </Button>
                    <Button onClick={() => setIsTopicOpen('AI')}>
                      Add With AI
                    </Button>
                  </HStack>
                </HStack>
                {topicData && (
                  <TopicPage
                    topicData={topicData}
                    setIsOpen={setIsTopicOpen}
                    setData={setOpenData}
                  />
                )}
              </VStack>
            </TabPanel>
          </TabPanels>
        </Tabs>
        <Modal
          isOpen={!!isCategoryOpen}
          onClose={onClose}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          {isCategoryOpen === 'Add' || isCategoryOpen === 'Edit' ? (
            <ModalContent w={'90%'} maxW={'1000px'}>
              <ModalHeader>
                {isCategoryOpen === 'Add' ? 'Add Category' : 'Edit Category'}
              </ModalHeader>
              <ModalBody>
                <CategoryForm
                  categoryData={openData}
                  onClose={onClose}
                  isCategoryOpen={isCategoryOpen}
                  setAllData={value => setAllData(value, 'category', 'edit')}
                  setNewData={value => setAllData(value, 'category', 'add')}
                  setDeleteData={value =>
                    setAllData(value, 'category', 'delete')
                  }
                />
              </ModalBody>
            </ModalContent>
          ) : (
            <ModalContent w={'90%'} maxW={'1000px'}>
              <ModalHeader>Generate AI Category</ModalHeader>
              <ModalBody>
                {isEmpty(categoryData?.name) ? (
                  <Button>Generate</Button>
                ) : (
                  <CategoryForm categoryData={openData} />
                )}
              </ModalBody>

              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Cancel
                </Button>
                {!isEmpty(categoryData?.name) && (
                  <Button variant='ghost'>Add</Button>
                )}
              </ModalFooter>
            </ModalContent>
          )}
        </Modal>
        <Modal
          isOpen={!!isTopicOpen}
          onClose={onClose}
          closeOnOverlayClick={false}
        >
          <ModalOverlay />
          {isTopicOpen === 'Add' || isTopicOpen === 'Edit' ? (
            <ModalContent w={'90%'} maxW={'1000px'}>
              <ModalHeader>
                {isTopicOpen === 'Add' ? 'Add Topic' : 'Edit Topic'}
              </ModalHeader>
              <ModalBody>
                <TopicForm
                  topicData={openData}
                  onClose={onClose}
                  categoryData={categoryData}
                  isTopicOpen={isTopicOpen}
                  setAllData={value => setAllData(value, 'topic', 'edit')}
                  setDeleteData={value => setAllData(value, 'topic', 'delete')}
                  setNewData={value => setAllData(value, 'topic', 'add')}
                />
              </ModalBody>
            </ModalContent>
          ) : (
            <ModalContent w={'90%'} maxW={'1000px'}>
              <ModalHeader>Generate AI Topic</ModalHeader>
              <ModalBody>
                {isEmpty(topicData?.name) ? (
                  <Button>Generate</Button>
                ) : (
                  <TopicForm topicData={openData} />
                )}
              </ModalBody>
              <ModalFooter>
                <Button colorScheme='blue' mr={3} onClick={onClose}>
                  Cancel
                </Button>
                <Button variant='ghost'>Add</Button>
              </ModalFooter>
            </ModalContent>
          )}
        </Modal>
      </VStack>
    )
  );
};

export default AdminWritingPage;
