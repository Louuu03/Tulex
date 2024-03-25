import React, { useEffect, useState } from 'react';
import { HStack, Select, useMediaQuery } from '@chakra-ui/react';
import en from '../../i18n/en.json';
import { cloneDeep, filter, orderBy } from 'lodash';
import { Article, Category, Topic } from '@/utils/common-type';

interface FiltersComponentProps {
  data: Category[] | Topic[] | Article[] | null;
  setData: React.Dispatch<React.SetStateAction<Category[]>>;
  visibleFilters: Array<
    'level' | 'language' | 'status' | 'subscription' | 'sort'
  >;
  userId?: string;
  type: string; // Currently just "category", but can be extended
}
/**
 * Should have two sets of data, one for the original data and one for the filtered data when using
 * @param data input data(should be original data in array)
 * @param setData set data to the filtered one
 * @param visibleFilters what filters to show
 * @param userId user id
 * @param type type of data, either "category" or "topic"
 * @returns
 */
const FiltersComponent: React.FC<FiltersComponentProps> = ({
  data,
  setData,
  visibleFilters,
  userId,
  type,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<any>(-1);
  const [selectedLanguage, setSelectedLanguage] = useState<any>('');
  const [selectedStatus, setSelectedStatus] = useState<any>(0);
  const [selectedSubscription, setSelectedSubscription] = useState<any>(-1);
  const [selectedSort, setSelectedSort] = useState<any>(0);

  // Fake data for the filters
  const levelOptions = en.Level;
  const languageOptions = en.options.language;
  const statusOptions = en.status;
  const subscriptionOptions = en.subscription;
  const sortOptions = [
    { name: 'Newest', value: 0 },
    { name: 'Oldest', value: 1 },
  ];
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  useEffect(() => {
    let newData:any = cloneDeep(data);
    if (
      type === 'topic' &&
      selectedLevel.length > 0 &&
      visibleFilters.includes('level')
    ) {
      newData = filter(newData, data => {
        return data.level == selectedLevel;
      });
    }
    if (selectedLanguage.length > 0 && visibleFilters.includes('language')) {
      newData = filter(newData, data => {
        return type === 'category'
          ? data.language.includes(selectedLanguage)
          : data.language == selectedLanguage;
      });
    }
    if (selectedStatus >= 0 && visibleFilters.includes('status')) {
      if (type === 'category') {
        newData = filter(newData, data => {
          return data.status == selectedStatus;
        });
      } else {
        newData = filter(newData, data => {
          const dataDate = new Date(data.endtime);
          return selectedStatus == 1
            ? dataDate < new Date()
            : dataDate >= new Date();
        });
      }
    }
    if (
      selectedSubscription.length > 0 &&
      visibleFilters.includes('subscription')
    ) {
      if (selectedSubscription == 0) {
        newData = filter(newData, data => {
          return !data.subscribed.includes(userId);
        });
      } else if (selectedSubscription == 1) {
        newData = filter(newData, data => {
          return data.subscribed.includes(userId);
        });
      }
    }
    if (visibleFilters.includes('sort')) {
      if (selectedSort == 0) {
        newData = orderBy(newData, ['endtime', 'name'], ['desc', 'asc']);
      } else if (selectedSort == 1) {
        newData = orderBy(newData, ['endtime', 'name'], ['asc', 'asc']);
      }
    }

    setData(newData);
  }, [
    selectedLevel,
    selectedLanguage,
    selectedStatus,
    selectedSubscription,
    selectedSort,
    data,
  ]);

  const renderSelect = (
    label: string,
    options: { name: string; value: number|string }[],
    selectedValue: string,
    onChange: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <Select
      placeholder={label !== 'Status' && label !== 'Sort' ? label : ''}
      value={selectedValue}
      onChange={e => onChange(e.target.value)}
      w={'100px'}
    >
      {options.map((option, index) => (
        <option className='filter-option' key={index} value={option.value}>
          {option.name}
        </option>
      ))}
    </Select>
  );

  return (
    <HStack
      spacing='5px'
      width={'calc(100% - 40px)'}
      justify={isLargerThan768 ? 'flex-start' : 'space-around'}
      ml={isLargerThan768 ? '10px' : ''}
      boxSizing='border-box'
      pt={2}
    >
      {visibleFilters.includes('level') &&
        renderSelect('Level', levelOptions, selectedLevel, setSelectedLevel)}
      {visibleFilters.includes('language') &&
        renderSelect(
          'Lang',
          languageOptions,
          selectedLanguage,
          setSelectedLanguage
        )}
      {visibleFilters.includes('status') &&
        renderSelect(
          'Status',
          statusOptions,
          selectedStatus,
          setSelectedStatus
        )}
      {visibleFilters.includes('subscription') &&
        renderSelect(
          'Subscription',
          subscriptionOptions,
          selectedSubscription,
          setSelectedSubscription
        )}
      {visibleFilters.includes('sort') &&
        renderSelect('Sort', sortOptions, selectedSort, setSelectedSort)}
    </HStack>
  );
};

export default FiltersComponent;
