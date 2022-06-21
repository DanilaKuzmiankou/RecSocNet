import { ListGroup } from 'react-bootstrap';
import React from 'react';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faHeart } from '@fortawesome/free-regular-svg-icons';
import {
  faCalendar as faTimerSolid,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNewReviewsClicked, setIsTopReviewsClicked } from '../../store/reducers/ReviewSlice';

export const RecommendationsMenu = (props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isNewReviewsClicked, isTopReviewsClicked } = useSelector((state) => state.review);

  const setClickedReview = (newReviewsClicked) => {
    dispatch(setIsNewReviewsClicked(newReviewsClicked));
    dispatch(setIsTopReviewsClicked(!newReviewsClicked));
    newReviewsClicked ? props.refreshNewestReviews() : props.refreshMostLikedReviews();
  };

  return (
    <ListGroup>
      <ListGroup.Item action onClick={() => setClickedReview(true)}>
        <div className='tools-container-div'>
          <div>
            <Rating
              start={0}
              stop={1}
              initialRating={isNewReviewsClicked}
              emptySymbol={<FontAwesomeIcon icon={faCalendar} color={'black'} size='2x' />}
              fullSymbol={<FontAwesomeIcon icon={faTimerSolid} size='2x' color={'black'} />}
            />
          </div>
          <div style={{ marginLeft: '10px' }}>{t('newest')}</div>
        </div>
      </ListGroup.Item>
      <ListGroup.Item action onClick={() => setClickedReview(false)}>
        <div className='tools-container-div'>
          <div>
            <Rating
              start={0}
              stop={1}
              initialRating={isTopReviewsClicked}
              emptySymbol={<FontAwesomeIcon icon={faHeart} color={'black'} size='2x' />}
              fullSymbol={<FontAwesomeIcon icon={faHeartSolid} size='2x' color={'black'} />}
            />
          </div>
          <div style={{ marginLeft: '7px' }}>{t('most_liked')}</div>
        </div>
      </ListGroup.Item>
    </ListGroup>
  );
};
