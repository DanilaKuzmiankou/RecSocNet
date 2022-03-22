import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faThumbsUp as faThumbsUpSolid } from '@fortawesome/free-solid-svg-icons';
import { faThumbsUp } from '@fortawesome/free-regular-svg-icons';
import Rating from 'react-rating';
import { changeReviewLikeState } from '../../api/store/RatingStore';
import { useSelector } from 'react-redux';
import { useAuth0 } from '@auth0/auth0-react';

export const Like = ({ updateReview, review }) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const [like, setLike] = useState(false);

  const { isAuthenticated } = useAuth0();

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (review?.ratings && review?.ratings[0]?.reviewScore !== undefined) {
        setLike(review.ratings[0]?.reviewScore);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [review]);

  const onLikeClick = async () => {
    if (isAuthenticated) {
      const result = await changeReviewLikeState(currentUser.authId, review.id);
      if (result.status === 200) {
        const newReview = Object.assign({}, review);
        newReview.usersReviewScore = result.data.usersReviewScore;
        setLike(result.data.liked);
        updateReview(newReview);
      } else {
        alert(result.message);
      }
    } else {
      /* using this construction we know, that react will anyway update state,
                even if prev value is equal to next value */
      setLike((prevState) => {
        prevState = null;
        return { ...prevState };
      });
      alert('Log in first!');
    }
  };

  return (
    <div>
      <Rating
        start={0}
        stop={1}
        initialRating={like}
        onClick={onLikeClick}
        emptySymbol={<FontAwesomeIcon icon={faThumbsUp} color={'black'} size='2x' />}
        fullSymbol={<FontAwesomeIcon icon={faThumbsUpSolid} size='2x' color={'red'} />}
      />
    </div>
  );
};
