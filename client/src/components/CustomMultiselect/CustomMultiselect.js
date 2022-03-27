import { Multiselect } from 'multiselect-react-dropdown';
import React, { useEffect, useState } from 'react';
import { getTags } from '../../api/store/ReviewStore';
import { useTranslation } from 'react-i18next';

const fieldName = 'tags';

export const CustomMultiselect = ({ field, form, ...props }) => {
  const [isEmptyTagExist, setIsEmptyTagExist] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState([]);
  const { t } = useTranslation();

  useEffect(() => {
    async function fetchData() {
      const tags = await getTags();
      setTags(tags);
    }
    fetchData();
  }, []);

  const onMultiselectSelect = (selectedList, selectedItem) => {
    if (selectedItem && field.value.indexOf(selectedItem) === -1 && selectedItem.trim()) {
      const newTagsList = [...field.value, selectedItem];
      form.setFieldValue(fieldName, newTagsList);
    }
  };

  const onMultiselectRemove = (selectedList, removedItem) => {
    let newTagsList = field.value;
    if (typeof removedItem === 'number') {
      newTagsList.splice(removedItem, 1);
    } else {
      newTagsList = newTagsList.filter((tag) => tag !== removedItem);
    }
    form.setFieldValue(fieldName, newTagsList);
  };

  const onMultiselectSearch = (searchedTag) => {
    setCurrentTag(searchedTag);
    if (searchedTag !== '') {
      if (isEmptyTagExist) {
        deleteLastTag();
      }
      if (tags.find((tag) => tag === searchedTag) === undefined) {
        setTags((tags) => [...tags, searchedTag]);
        setIsEmptyTagExist(true);
      } else {
        deleteLastTag();
      }
    } else {
      setIsEmptyTagExist(false);
      deleteLastTag();
    }
  };

  const deleteLastTag = () => {
    const newTags = [...tags];
    newTags.pop();
    setTags(newTags);
  };

  const onMultiselectKeyPress = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      onMultiselectSelect([], currentTag);
      setCurrentTag();
    }
  };

  return (
    <div>
      <Multiselect
        isObject={false}
        className='custom-multiselect'
        selectedValues={field.value}
        avoidHighlightFirstOption={true}
        onKeyPressFn={onMultiselectKeyPress}
        onRemove={onMultiselectRemove}
        onSearch={onMultiselectSearch}
        onSelect={onMultiselectSelect}
        options={tags}
        placeholder={t('enter_tags')}
      />
    </div>
  );
};
