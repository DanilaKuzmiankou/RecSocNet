import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar, faHeart } from '@fortawesome/free-regular-svg-icons';
import {
  faCalendar as faTimerSolid,
  faHeart as faHeartSolid,
} from '@fortawesome/free-solid-svg-icons';
import Rating from 'react-rating';
import { Col, Container, Row } from 'react-bootstrap';

export const ToolsContainer = (props) => {
  const [isNewReviewsClicked, setIsNewReviewsClicked] = useState(false);
  const [isTopReviewsClicked, setIsTopReviewsClicked] = useState(false);
  const onNewReviewsClick = () => {
    setIsNewReviewsClicked((isNewReviewsClicked) => !isNewReviewsClicked);
    props.refreshNewestReviews();
    setTimeout(async () => {
      setIsNewReviewsClicked((isNewReviewsClicked) => !isNewReviewsClicked);
    }, 250);
  };
  const onTopReviewsClick = () => {
    setIsTopReviewsClicked((isTopReviewsClicked) => !isTopReviewsClicked);
    props.fetchMostLikedReviews();
    setTimeout(async () => {
      setIsTopReviewsClicked((isTopReviewsClicked) => !isTopReviewsClicked);
    }, 250);
  };
  return (
    <Container fluid className='recommendations_page_tools_container'>
      <Row>
        <Col className='tools_container_div'>
          <div>
            <div>Newest</div>
            <Rating
              start={0}
              stop={1}
              initialRating={isNewReviewsClicked}
              onClick={onNewReviewsClick}
              emptySymbol={<FontAwesomeIcon icon={faCalendar} color={'black'} size='4x' />}
              fullSymbol={<FontAwesomeIcon icon={faTimerSolid} size='4x' color={'black'} />}
            />
          </div>
        </Col>
        <Col className='tools_container_div'>
          <div>
            <div>Most liked</div>
            <Rating
              start={0}
              stop={1}
              initialRating={isTopReviewsClicked}
              onClick={onTopReviewsClick}
              emptySymbol={<FontAwesomeIcon icon={faHeart} color={'black'} size='4x' />}
              fullSymbol={<FontAwesomeIcon icon={faHeartSolid} size='4x' color={'black'} />}
            />
          </div>
        </Col>
      </Row>
    </Container>
  );
};
