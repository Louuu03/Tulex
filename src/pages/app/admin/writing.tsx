// pages/login.tsx
import FiltersComponent from '@/components/layout/filter';
import {
  Button,
  VStack,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
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
} from '@chakra-ui/react';
import { on } from 'events';
import { isEmpty } from 'lodash';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { AiOutlinePlus, AiOutlineMinus } from 'react-icons/ai';

interface CategoryData {
  name: string;
  short: string;
  long: string;
  status: 'active' | 'disactive';
  language: 'french' | 'english';
  create_time: string;
}
interface CategoryFormProps {
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
  categoryData: CategoryData;
  setCategoryData: React.Dispatch<React.SetStateAction<CategoryData>>;
}
const initialCategoryData: CategoryData = {
  name: '',
  short: '',
  long: '',
  status: 'active',
  language: 'english',
  create_time: new Date().toISOString().substring(0, 10),
};

interface Step {
  name: string;
  details: string;
}

interface TopicData {
  name: string;
  create_time: string;
  description: string;
  endtime: string;
  steps: Step[];
  category: string;
  example: string[];
  language: 'English' | 'French';
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
}

const initialTopicData: TopicData = {
  name: '',
  create_time: new Date().toISOString().substring(0, 10),
  description: '',
  endtime: new Date().toISOString().substring(0, 10),
  steps: [{ name: '', details: '' }],
  category: '',
  example: [],
  language: 'English',
  level: 'A1',
};
interface TopicFormProps {
  topicData: TopicData;
  setTopicData: React.Dispatch<React.SetStateAction<TopicData>>;
  isEditable: boolean;
  setIsEditable: React.Dispatch<React.SetStateAction<boolean>>;
}

const CategoryForm: React.FC<CategoryFormProps> = ({
  isEditable,
  setIsEditable,
  categoryData,
  setCategoryData,
}) => {
  const toast = useToast();

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setCategoryData(prevFormData => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Here you would typically send the formData to your backend.
    toast({
      title: 'Form submitted',
      description: "We've received your submission.",
      status: 'success',
      duration: 9000,
      isClosable: true,
    });
  };

  return (
    <Box p={4}>
      <form onSubmit={handleSubmit}>
        <FormControl isRequired mb={4}>
          <FormLabel htmlFor='name'>Name</FormLabel>
          {isEditable ? (
            <Input
              id='name'
              name='name'
              value={categoryData.name}
              onChange={handleChange}
            />
          ) : (
            <Box>{categoryData.name}</Box>
          )}
        </FormControl>
        <FormControl>
          <FormLabel>Create Time</FormLabel>
          {isEditable ? (
            <Input
              type='date'
              name='create_time'
              value={categoryData.create_time}
              onChange={handleChange}
            />
          ) : (
            <Text>
              {new Date(categoryData.create_time).toLocaleDateString()}
            </Text>
          )}
        </FormControl>
        <FormControl isRequired mb={4}>
          <FormLabel htmlFor='short'>Short Description</FormLabel>
          {isEditable ? (
            <Textarea
              id='short'
              name='short'
              value={categoryData.short}
              onChange={handleChange}
            />
          ) : (
            <Box>{categoryData.short}</Box>
          )}
        </FormControl>
        <FormControl isRequired mb={4}>
          <FormLabel htmlFor='long'>Long Description</FormLabel>
          {isEditable ? (
            <Textarea
              id='long'
              name='long'
              value={categoryData.long}
              onChange={handleChange}
            />
          ) : (
            <Box>{categoryData.long}</Box>
          )}
        </FormControl>
        <FormControl isRequired mb={4}>
          <FormLabel htmlFor='status'>Status</FormLabel>
          {isEditable ? (
            <Select
              id='status'
              name='status'
              value={categoryData.status}
              onChange={handleChange}
            >
              <option value='active'>Active</option>
              <option value='disactive'>Disactive</option>
            </Select>
          ) : (
            <Box>{categoryData.status}</Box>
          )}
        </FormControl>
        <FormControl isRequired mb={4}>
          <FormLabel htmlFor='language'>Language</FormLabel>
          {isEditable ? (
            <Select
              id='language'
              name='language'
              value={categoryData.language}
              onChange={handleChange}
            >
              <option value='english'>English</option>
              <option value='french'>French</option>
            </Select>
          ) : (
            <Box>{categoryData.language}</Box>
          )}
        </FormControl>
        <HStack>
          {!isEditable && (
            <Button onClick={() => setIsEditable(true)} mb={4}>
              Edit
            </Button>
          )}
        </HStack>
      </form>
    </Box>
  );
};
const TopicForm: React.FC<TopicFormProps> = ({
  topicData,
  setTopicData,
  isEditable,
  setIsEditable,
}) => {
  const toast = useToast();

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
    index?: number,
    field?: string
  ) => {
    const { name, value } = e.target;
    if (typeof index === 'number' && field) {
      const newSteps = [...topicData.steps];
      newSteps[index] = { ...newSteps[index], [field]: value };
      setTopicData({ ...topicData, steps: newSteps });
    } else {
      setTopicData({ ...topicData, [name]: value });
    }
  };

  const handleAddStep = () => {
    const newSteps = [...topicData.steps, { name: '', details: '' }];
    setTopicData({ ...topicData, steps: newSteps });
  };

  const handleRemoveStep = (index: number) => {
    const newSteps = [...topicData.steps];
    if (newSteps.length > 1) {
      newSteps.splice(index, 1);
      setTopicData({ ...topicData, steps: newSteps });
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

  // Add here your form submit handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(topicData);
  };

  return (
    <Box as='form' onSubmit={handleSubmit} p={4}>
      <VStack spacing={4} align='flex-start'>
        <FormControl>
          <FormLabel>Name</FormLabel>
          {isEditable ? (
            <Input
              name='name'
              value={topicData.name}
              onChange={handleInputChange}
            />
          ) : (
            <Text>{topicData.name}</Text>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Create Time</FormLabel>
          {isEditable ? (
            <Input
              type='date'
              name='create_time'
              value={topicData.create_time}
              onChange={handleInputChange}
            />
          ) : (
            <Text>{new Date(topicData.create_time).toLocaleDateString()}</Text>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Description</FormLabel>
          {isEditable ? (
            <Textarea
              name='description'
              value={topicData.description}
              onChange={handleInputChange}
            />
          ) : (
            <Text>{topicData.description}</Text>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>End Time</FormLabel>
          {isEditable ? (
            <Input
              type='date'
              name='endtime'
              value={topicData.endtime}
              onChange={handleInputChange}
            />
          ) : (
            <Text>{new Date(topicData.endtime).toLocaleDateString()}</Text>
          )}
        </FormControl>

        {topicData.steps.map((step, index) => (
          <HStack key={index} spacing={4} align='flex-Start'>
            <FormControl>
              <FormLabel>Step Name</FormLabel>
              {isEditable ? (
                <Input
                  name={`stepName-${index}`}
                  value={step.name}
                  onChange={e => handleInputChange(e, index, 'name')}
                />
              ) : (
                <Text>{step.name}</Text>
              )}
            </FormControl>
            <FormControl>
              <FormLabel>Details</FormLabel>
              {isEditable ? (
                <Textarea
                  name={`stepDetails-${index}`}
                  rows={1}
                  value={step.details}
                  onChange={e => handleInputChange(e, index, 'details')}
                />
              ) : (
                <Text>{step.details}</Text>
              )}
            </FormControl>
            {isEditable && (
              <IconButton
                mt='32px'
                aria-label='Remove step'
                icon={<AiOutlineMinus />}
                onClick={() => handleRemoveStep(index)}
              />
            )}
          </HStack>
        ))}
        {isEditable && (
          <Button leftIcon={<AiOutlinePlus />} onClick={handleAddStep}>
            Add Step
          </Button>
        )}

        <FormControl>
          <FormLabel>Category</FormLabel>
          {isEditable ? (
            <Select
              name='category'
              value={topicData.category}
              onChange={handleInputChange}
            >
              <option value='Easy'>Easy</option>
              <option value='Intermediate'>Intermediate</option>
              <option value='Hard'>Hard</option>
            </Select>
          ) : (
            <Text>{topicData.category}</Text>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Example</FormLabel>
          {isEditable ? (
            <Textarea
              name='example'
              value={topicData.example}
              onChange={handleInputChange}
            />
          ) : (
            <Text>{topicData.example}</Text>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Language</FormLabel>
          {isEditable ? (
            <Select
              name='language'
              value={topicData.language}
              onChange={handleInputChange}
            >
              <option value='English'>English</option>
              <option value='French'>French</option>
            </Select>
          ) : (
            <Text>{topicData.language}</Text>
          )}
        </FormControl>

        <FormControl>
          <FormLabel>Level</FormLabel>
          {isEditable ? (
            <Select
              name='level'
              value={topicData.level}
              onChange={handleInputChange}
            >
              {['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map(level => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </Select>
          ) : (
            <Text>{topicData.level}</Text>
          )}
        </FormControl>

        {!isEditable && (
          <Button onClick={() => setIsEditable(true)}>Edit</Button>
        )}
      </VStack>
    </Box>
  );
};

const LoginPage: React.FC = () => {
  const [isCategoryOpen, setIsCategoryOpen] = useState<
    false | 'AI' | 'Add' | 'Edit'
  >(false);
  const [isTopicOpen, setIsTopicOpen] = useState<false | 'AI' | 'Add' | 'Edit'>(
    false
  );
  const [isEditable, setIsEditable] = useState<boolean>(true);
  const [categoryData, setCategoryData] =
    useState<CategoryData>(initialCategoryData);
  const [topicData, setTopicData] = useState<TopicData>(initialTopicData);

  const router = useRouter();

  const onClose = () => {
    setIsCategoryOpen(false);
    setIsEditable(false);
    setIsTopicOpen(false);
    setCategoryData(initialCategoryData);
    setTopicData(initialTopicData);
  };

  return (
    <VStack
      align='center'
      className='login-container'
      width={'100%'}
      px={'20px'}
    >
      <Button mt={5} onClick={() => router.push('/app/admin/speaking')}>
        To Speaking
      </Button>
      <Tabs width={'100%'} mx={'20px'}>
        <TabList>
          <Tab>Category</Tab>
          <Tab>Topics</Tab>
        </TabList>
        <TabPanels>
          <TabPanel>
            <Flex justifyContent='space-between' mb={4} w={'100%'}>
              <HStack justify={'space-between'} w={'100%'}>
                <FiltersComponent
                  visibleFilters={['level', 'language', 'status']}
                />
                <HStack>
                  <Button
                    onClick={() => {
                      setIsCategoryOpen('Add');
                      setIsEditable(true);
                    }}
                  >
                    Add Category
                  </Button>
                  <Button onClick={() => setIsCategoryOpen('AI')}>
                    Add With AI
                  </Button>
                </HStack>
              </HStack>
            </Flex>
          </TabPanel>
          <TabPanel>
            <Flex justifyContent='space-between' mb={4} w={'100%'}>
              <HStack justify={'space-between'} w={'100%'}>
                <FiltersComponent
                  visibleFilters={['level', 'language', 'status']}
                />
                <HStack>
                  <Button
                    onClick={() => {
                      setIsTopicOpen('Add');
                      setIsEditable(true);
                    }}
                  >
                    Add Topic
                  </Button>
                  <Button onClick={() => setIsTopicOpen('AI')}>
                    Add With AI
                  </Button>
                </HStack>
              </HStack>
            </Flex>
          </TabPanel>
        </TabPanels>
      </Tabs>
      <Modal
        isOpen={!!isCategoryOpen}
        onClose={onClose}
        closeOnOverlayClick={false}
      >
        <ModalOverlay />
        {isCategoryOpen === 'Add' ? (
          <ModalContent>
            <ModalHeader>Add Category</ModalHeader>
            <ModalBody>
              <CategoryForm
                isEditable={isEditable}
                setIsEditable={setIsEditable}
                categoryData={categoryData}
                setCategoryData={setCategoryData}
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button variant='ghost'>Add</Button>
            </ModalFooter>
          </ModalContent>
        ) : (
          <ModalContent>
            <ModalHeader>Generate AI Category</ModalHeader>
            <ModalBody>
              {isEmpty(categoryData.name) ? (
                <Button>Generate</Button>
              ) : (
                <CategoryForm
                  isEditable={isEditable}
                  setIsEditable={setIsEditable}
                  categoryData={categoryData}
                  setCategoryData={setCategoryData}
                />
              )}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Cancel
              </Button>
              {!isEmpty(categoryData.name) && (
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
        {isTopicOpen === 'Add' ? (
          <ModalContent>
            <ModalHeader>Add Topic</ModalHeader>
            <ModalBody>
              <TopicForm
                isEditable={isEditable}
                setIsEditable={setIsEditable}
                topicData={topicData}
                setTopicData={setTopicData}
              />
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Cancel
              </Button>
              <Button variant='ghost'>Add</Button>
            </ModalFooter>
          </ModalContent>
        ) : (
          <ModalContent>
            <ModalHeader>Generate AI Topic</ModalHeader>
            <ModalBody>
              {isEmpty(categoryData.name) ? (
                <Button>Generate</Button>
              ) : (
                <TopicForm
                  isEditable={isEditable}
                  setIsEditable={setIsEditable}
                  topicData={topicData}
                  setTopicData={setTopicData}
                />
              )}
            </ModalBody>

            <ModalFooter>
              <Button colorScheme='blue' mr={3} onClick={onClose}>
                Cancel
              </Button>
              {!isEmpty(categoryData.name) && (
                <Button variant='ghost'>Add</Button>
              )}
            </ModalFooter>
          </ModalContent>
        )}
      </Modal>
    </VStack>
  );
};

export default LoginPage;
