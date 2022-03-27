import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faHeart } from '@fortawesome/free-regular-svg-icons';
import {
  faCalendar as faTimerSolid,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import Rating from 'react-rating';
import { Col, Container, Row } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { setIsNewReviewsClicked, setIsTopReviewsClicked } from '../../store/reducers/ReviewSlice';
import { useTranslation } from 'react-i18next';

export const ToolsContainer = (props) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { isNewReviewsClicked, isTopReviewsClicked } = useSelector((state) => state.review);

  const setClickedReview = (newReviewsClicked) => {
    dispatch(setIsNewReviewsClicked(newReviewsClicked));
    dispatch(setIsTopReviewsClicked(!newReviewsClicked));
    newReviewsClicked ? props.refreshNewestReviews() : props.refreshMostLikedReviews();
  };

  return (
    <Container fluid className='recommendations-page-tools-container'>
      <Row>
        <Col className='tools-container-div'>
          <div>
            <div>{t('newest')}</div>
            <div className='tools-container-div'>
              <Rating
                start={0}
                stop={1}
                initialRating={isNewReviewsClicked}
                onClick={() => setClickedReview(true)}
                emptySymbol={<FontAwesomeIcon icon={faCalendar} color={'black'} size='4x' />}
                fullSymbol={<FontAwesomeIcon icon={faTimerSolid} size='4x' color={'black'} />}
              />
            </div>
          </div>
        </Col>
        <Col className='tools-container-div'>
          <div>
            <div>{t('most_liked')}</div>
            <div className='tools-container-div'>
              <Rating
                start={0}
                stop={1}
                initialRating={isTopReviewsClicked}
                onClick={() => setClickedReview(false)}
                emptySymbol={<FontAwesomeIcon icon={faHeart} color={'black'} size='4x' />}
                fullSymbol={<FontAwesomeIcon icon={faHeartSolid} size='4x' color={'black'} />}
              />
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
