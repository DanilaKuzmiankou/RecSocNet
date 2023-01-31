import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faComment } from '@fortawesome/free-regular-svg-icons';
import { faComment as faCommentSolid } from '@fortawesome/free-solid-svg-icons';
import Rating from 'react-rating';
import { useAuth0 } from '@auth0/auth0-react';

export const Comments = () => {
  const [comments, setComments] = useState(false);
  const { isAuthenticated, loginWithRedirect } = useAuth0();

  const onCommentsClick = () => {
    if (isAuthenticated) {
      setComments(!comments);
    } else {
      loginWithRedirect();
    }
  };

  return (
    <Rating
      start={0}
      stop={1}
      initialRating={comments}
      onClick={onCommentsClick}
      emptySymbol={<FontAwesomeIcon icon={faComment} color={'black'} size='2x' />}
      fullSymbol={<FontAwesomeIcon icon={faCommentSolid} size='2x' color={'black'} />}
    />
  );
};
