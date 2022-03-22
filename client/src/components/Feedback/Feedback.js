import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import StarRatings from 'react-star-ratings/build/star-ratings';
import React, { useEffect, useState } from 'react';
import { Like } from './Like';
import { Comments } from './Comments';
import { changeReviewUsersContentScore } from '../../api/store/RatingStore';
import { useSelector } from 'react-redux';
import '../../App.css';
import { useAuth0 } from '@auth0/auth0-react';

export const Feedback = (props) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { isAuthenticated } = useAuth0();

  const [rating, setRating] = useState(0);
  const [review, setReview] = useState({});

  useEffect(() => {
    let isMounted = true;
    if (isMounted && props.review) {
      const review = Object.assign({}, props.review);
      review.usersContentScore = +review.usersContentScore.toFixed(2);
      setReview(review);
      if (
        review.ratings &&
        review.ratings[0] &&
        review.ratings[0].contentScore &&
        review.ratings[0].contentScore !== undefined
      ) {
        setRating(review.ratings[0].contentScore);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [props]);

  const changeRating = async (newRating) => {
    if (isAuthenticated) {
      const response = await changeReviewUsersContentScore(
        currentUser.authId,
        props.review.id,
        newRating
      );
      let reviewUsersContentScore = response.data.usersContentScore;
      reviewUsersContentScore = +reviewUsersContentScore.toFixed(2);
      switch (response.status) {
        case 200:
          setRating(newRating);
          break;
        case 202:
          setRating(0);
          break;
        default:
          alert('Error while changing rating! Reload Page please!');
          break;
      }
      saveEditedReview(reviewUsersContentScore, newRating);
    } else {
      alert('Log in first!');
    }
  };

  const saveEditedReview = (reviewUsersContentScore, newRating) => {
    setReview((prevState) => ({
      ...prevState,
      usersContentScore: reviewUsersContentScore,
    }));
  };

  return (
    <div className='d-flex align-items-end justify-content-around'>
      <span style={{ fontSize: '1.4rem' }}>
        {review.usersReviewScore}
        &nbsp;
      </span>
      <Like review={props.review} updateReview={(newReview) => setReview(newReview)} />
      <span>&nbsp;&nbsp;</span>
      <Comments />
      <span>&nbsp;&nbsp;</span>
      <OverlayTrigger
        placement='top'
        delay={{ show: 150, hide: 200 }}
        overlay={
          <Tooltip id='tooltip-disabled'>Average content score: {review.usersContentScore}</Tooltip>
        }
      >
        <div className='feedback_rating'>
          <StarRatings
            rating={rating}
            starRatedColor='#ffd700'
            starHoverColor='#ffd700'
            numberOfStars={5}
            starDimension='2rem'
            changeRating={changeRating}
            name='rating'
          />
        </div>
      </OverlayTrigger>
    </div>
  );
};
