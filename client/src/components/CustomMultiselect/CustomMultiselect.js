import { Multiselect } from 'multiselect-react-dropdown';
import React, { useState } from 'react';

const fieldName = 'tags';

export const CustomMultiselect = ({ field, tagsArray, form, ...props }) => {
  const [isEmptyTagExist, setIsEmptyTagExist] = useState(false);
  const [currentTag, setCurrentTag] = useState('');
  const [tags, setTags] = useState(tagsArray);
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
    form.setFieldValue(newTagsList);
  };

  const onMultiselectSearch = (searchedTag) => {
    setCurrentTag(searchedTag);
    if (isEmptyTagExist) {
      deleteLastTag();
    }
    if (tags.find((tag) => tag === searchedTag) === undefined) {
      setTags((tags) => [...tags, searchedTag]);
      setIsEmptyTagExist(true);
    } else {
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
        selectedValues={field.value}
        avoidHighlightFirstOption={true}
        onKeyPressFn={onMultiselectKeyPress}
        onRemove={onMultiselectRemove}
        onSearch={onMultiselectSearch}
        onSelect={onMultiselectSelect}
        options={tags}
        placeholder='Enter tags'
      />
    </div>
  );
};
