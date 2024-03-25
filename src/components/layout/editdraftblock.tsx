import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  HStack,
  Text,
  Textarea,
  VStack,
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import { DateTime } from 'luxon';
import { Article } from '@/utils/common-type';

interface EditDraftBlockProps {
  isSubmitted?: boolean;
  article: Article;
  setIsOpen: () => void;
  setArticle: (content: Article) => void;
}

const EditDraftBlock: React.FC<EditDraftBlockProps> = ({
  isSubmitted,
  article,
  setIsOpen,
  setArticle,
}) => {
  const [isAutoSave, setIsAutoSave] = useState({ loacal: false, db: false });
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState(article.content);
  const toast = useToast();

  const saveContentToLocal = () => {
    setIsLoading(true);
    const contentToSave = {
      id: article._id,
      content: content,
    };
    localStorage.setItem(
      'articleContent_' + article._id,
      JSON.stringify(contentToSave)
    );
    setIsAutoSave({ ...isAutoSave, loacal: false });
    setIsLoading(false);
  };

  const saveContentToDB = (content, time) => {
    setIsLoading(true);
    return axios
      .put(`/api/writing/topic?id=${article._id}&method=save`, {
        content: content.length > 0 ? content : '',
        time,
      })
      .then(res => {
        setIsAutoSave({ loacal: false, db: false });
        setIsLoading(false);
        setArticle({
          ...article,
          last_save: DateTime.fromISO(time)
            .toLocal()
            .toFormat('yyyy-MM-dd hh:mm:ss a'),
        });
        return true;
      })
      .catch(err => {
        setIsAutoSave({ loacal: false, db: false });
        setIsLoading(false);
        return false;
      });
  };

  const onSave = async () => {
    saveContentToLocal();
    const result = await saveContentToDB(content, DateTime.now().toString());
    toast({
      title: result ? 'Saved' : 'Saving Failed',
      description: result
        ? 'Your draft has been saved'
        : 'An unexpected error occurred',
      status: result ? 'success' : 'error',
      duration: 3000,
      isClosable: true,
    });
  };

  const onSubmit = async () => {
    if (content.length > 0) {
      setArticle({ ...article, content });
      setIsOpen();
    } else {
      toast({
        title: 'Please write something',
        description: 'You need to write something before submitting',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  //Autosave count
  useEffect(() => {
    if (isAutoSave.db) {
      const db = setTimeout(() => {
        let savedContent = localStorage.getItem(
          'articleContent_' + article._id
        );
        savedContent && (savedContent = JSON.parse(savedContent));
        saveContentToDB(savedContent, new Date());
      }, 300000); // save content to db every 5 minutes
      return () => clearTimeout(db);
    }
  }, [isAutoSave.db]);

  useEffect(() => {
    if (isAutoSave.loacal) {
      const ls = setTimeout(() => {
        saveContentToLocal();
      }, 5000); // save content to local storage every 5 seconds
      return () => clearTimeout(ls);
    }
  }, [isAutoSave.loacal]);
  useEffect(() => {
    if (!isAutoSave.db && !isAutoSave.loacal) {
      setIsAutoSave({ loacal: true, db: true });
    } else if (!isAutoSave.db) {
      !isAutoSave.db && setIsAutoSave({ ...isAutoSave, db: true });
    } else if (!isAutoSave.loacal) {
      !isAutoSave.loacal && setIsAutoSave({ ...isAutoSave, loacal: true });
    }
  }, [content]);

  //Get Local Storage to content
  useEffect(() => {
    let savedContent:any = localStorage.getItem('articleContent_' + article._id);
    savedContent && (savedContent = JSON.parse(savedContent));
    let newArticle=article
    newArticle.last_save=DateTime.fromISO(article.last_save).toLocal().toFormat('yyyy-MM-dd')
    if (savedContent) {
      setArticle({ ...newArticle, content: savedContent.content });
      setContent(savedContent.content);
    } else {
      setContent(article.content);
    }
  }, []);

  return (
    <Box className='editdraftblock-container'>
      <HStack justify={'space-between'}>
        <VStack
          align={'flex-start'}
          spacing={0}
          color={'gray'}
          fontSize={'14px'}
        >
          <Text>{isSubmitted ? 'Submission:' : 'Last Saved:'}</Text>
          <Text>{article.last_save as string}</Text>
        </VStack>
        {!isSubmitted && (
          <HStack mb={2} justifyContent={'flex-end'}>
            <Button
              isDisabled={isLoading}
              onClick={() => {
                onSave();
              }}
            >
              Save
            </Button>
            <Button
              isDisabled={isLoading}
              bg={'#ecc94b'}
              onClick={() => {
                onSubmit();
              }}
            >
              Submit
            </Button>
          </HStack>
        )}
      </HStack>
      {isSubmitted ? (
        <Text>{article.content}</Text>
      ) : (
        <Textarea
          placeholder='Start writing here...'
          rows={20}
          defaultValue={content}
          onChange={e => setContent(e.target.value)}
        />
      )}
    </Box>
  );
};

export default EditDraftBlock;
