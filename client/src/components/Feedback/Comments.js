import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faComment as faCommentSolid } from '@fortawesome/free-solid-svg-icons';
import Rating from 'react-rating';

export const Comments = (props) => {
  const [comments, setComments] = useState(false);

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      // setLikes(props?.likes)
    }
    return () => {
      isMounted = false;
    };
  }, [props]);

  const onCommentsClick = () => {
    setComments(!comments);
    console.log('opening comments...');
  };

  return (
    <div>
      <Rating
        start={0}
        stop={1}
        initialRating={comments}
        onClick={onCommentsClick}
        emptySymbol={<FontAwesomeIcon icon={faComment} color={'black'} size="2x" />}
        fullSymbol={<FontAwesomeIcon icon={faCommentSolid} size="2x" color={'black'} />}
      />
    </div>
  );
};
