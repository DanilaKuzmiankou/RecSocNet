import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import StarRatings from 'react-star-ratings/build/star-ratings';
import { useEffect, useState } from 'react';
import { Like } from '../Like/Like';
import { Comments } from '../Comments/Comments';
import { changeReviewUsersContentScore } from '../../../api/store/RatingStore';
import { useSelector } from 'react-redux';
import './Feedback.css';
import { useAuth0 } from '@auth0/auth0-react';
import { useTranslation } from 'react-i18next';

export const Feedback = (props) => {
  const currentUser = useSelector((state) => state.user.currentUser);
  const { t } = useTranslation();
  const { isAuthenticated, loginWithRedirect } = useAuth0();
  const [rating, setRating] = useState(0);
  const [review, setReview] = useState({});

  useEffect(() => {
    let isMounted = true;
    if (isMounted && props.review) {
      initFeedback();
    }
    return () => {
      isMounted = false;
    };
  }, [props]);

  const initFeedback = () => {
    const review = Object.assign({}, props.review);
    review.usersContentScore = +review.usersContentScore.toFixed(2);
    setReview(review);
    if (review?.ratings && review?.ratings[0] && review.ratings[0].contentScore) {
      setRating(review.ratings[0].contentScore);
    }
  };

  const changeRating = async (newRating) => {
    if (isAuthenticated) {
      const response = await changeReviewUsersContentScore(
        currentUser.authId,
        props.review.id,
        newRating
      );
      saveNewRating(response, newRating);
    } else {
      loginWithRedirect();
    }
  };

  const saveNewRating = (response, newRating) => {
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
        console.log('Error while changing rating! Reload page please!');
        break;
    }
    saveEditedReview(reviewUsersContentScore);
  };

  const saveEditedReview = (reviewUsersContentScore) => {
    setReview((prevState) => ({
      ...prevState,
      usersContentScore: reviewUsersContentScore,
    }));
  };

  return (
    <div className='feedback-container'>
      <h2>{review.usersReviewScore}</h2>
      <Like review={props.review} updateReview={(newReview) => setReview(newReview)} />
      <Comments />
      <OverlayTrigger
        placement='top'
        delay={{ show: 150, hide: 200 }}
        overlay={
          <Tooltip id='tooltip-disabled'>
            {t('average_content_score')} {review.usersContentScore}
          </Tooltip>
        }
      >
        <StarRatings
          rating={rating}
          starRatedColor='#ffd700'
          starHoverColor='#ffd700'
          numberOfStars={5}
          starDimension='1.3rem'
          changeRating={changeRating}
          name='rating'
        />
      </OverlayTrigger>
    </div>
  );
};
