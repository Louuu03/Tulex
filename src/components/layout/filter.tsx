import React, { useState } from 'react';
import { HStack, Select, useMediaQuery } from '@chakra-ui/react';

interface FiltersComponentProps {
  visibleFilters: Array<'level' | 'language' | 'status' | 'subscription'>;
}

const FiltersComponent: React.FC<FiltersComponentProps> = ({
  visibleFilters,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('');
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [selectedSubscription, setSelectedSubscription] = useState<string>('');

  // Fake data for the filters
  const levelOptions = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
  const languageOptions = ['English', 'French'];
  const statusOptions = ['Ongoing', 'Past'];
  const subscriptionOptions = ['Subscribed', 'Unsubscribed'];
  const [isLargerThan768] = useMediaQuery('(min-width: 768px)');

  const renderSelect = (
    label: string,
    options: string[],
    selectedValue: string,
    onChange: React.Dispatch<React.SetStateAction<string>>
  ) => (
    <Select
      placeholder={label}
      value={selectedValue}
      onChange={e => onChange(e.target.value)}
      w={'100px'}
    >
      {options.map((option, index) => (
        <option className='filter-option' key={index} value={option}>
          {option}
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
        renderSelect('Staus', statusOptions, selectedStatus, setSelectedStatus)}
      {visibleFilters.includes('subscription') &&
        renderSelect(
          'Subscription',
          subscriptionOptions,
          selectedSubscription,
          setSelectedSubscription
        )}
    </HStack>
  );
};

export default FiltersComponent;
