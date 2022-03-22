import React from 'react';

export const modules = {
  toolbar: [
    ['bold', 'italic', 'underline', 'strike'],
    ['blockquote', 'code-block'],

    [{ header: 1 }, { header: 2 }],
    [{ list: 'ordered' }, { list: 'bullet' }],
    [{ script: 'sub' }, { script: 'super' }],
    [{ indent: '-1' }, { indent: '+1' }],
    [{ direction: 'rtl' }],

    [{ size: ['small', 'large'] }],
    [{ header: [1, 2, 3, 4, 5, 6] }],

    [{ color: [] }, { background: [] }],
    [{ font: [] }],
    [{ align: [] }],

    ['clean'],
  ],
};

const categories = ['books', 'games', 'music', 'lifestyle'];

export const options = categories.map((item) => {
  return (
    <option key={item} value={item}>
      {item}
    </option>
  );
});
