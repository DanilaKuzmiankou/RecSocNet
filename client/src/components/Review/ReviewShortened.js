import { Col, Container, Row } from 'react-bootstrap';
import StarRatings from 'react-star-ratings/build/star-ratings';
import React, { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { Feedback } from '../Feedback/Feedback';
import { setEditedReview } from '../../store/reducers/ReviewSlice';
import { setModalParams } from '../../store/reducers/ModalSlice';
import { CustomModal } from '../CustomModal/CustomModal';
import { useDispatch, useSelector } from 'react-redux';
import { changeSingleDateToUserTimezone } from '../../utils/Utils';

export const ReviewShortened = (props) => {
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.review.reviews);

  const [editorText, setEditorText] = useState('');
  const [currentReview, setCurrentReview] = useState('');
  const reviewsModal = useRef();

  useEffect(async () => {
    let isMounted = true;
    if (isMounted) {
      if (reviews[props.reviewId] !== undefined) {
        const shortenedText = formatText(props.currentReview?.text);
        const newReview = JSON.parse(JSON.stringify(reviews[props.reviewId]));
        // newReview.user.name = formatStringLength(newReview.user.name, 13);
        setCurrentReview(newReview);
        setEditorText(shortenedText);
      }
    }
    return () => {
      isMounted = false;
    };
  }, [reviews, props]);

  const formatText = (text) => {
    if (text.length >= process.env.REACT_APP_MAX_TABLE_TEXT_LENGTH) {
      text = text.substring(0, process.env.REACT_APP_MAX_TABLE_TEXT_LENGTH);
      return text + '... <p>&nbsp;</p><strong><em>Click to read more!</em></strong>';
    } else {
      return text;
    }
  };

  const viewReview = (review) => {
    if (Object.keys(review).length !== 0) {
      dispatch(setEditedReview(review));
      dispatch(
        setModalParams({
          title: 'Review View',
          displayModalButtons: 'none',
          displayModalFeedback: '',
          displayEditForm: false,
          displayViewForm: true,
          displayHeader: 'none',
          backdrop: 'true',
        })
      );
      reviewsModal?.current.showReviewModal();
    }
  };

  return (
    <div>
      <div
        style={{
          padding: '30px',
          backgroundColor: 'white',
        }}
      >
        <Container className='p-0'>
          <Row>
            <Col
              xs={9}
              style={{
                whiteSpace: 'nowrap',
                textOverflow: 'ellipsis',
                overflow: 'hidden',
              }}
            >
              <label style={{ fontSize: '1rem', fontStyle: 'italic' }}>by </label>
              <a
                style={{ marginLeft: '10px', fontSize: '1.3rem' }}
                className='review_shortened_profile_url'
                href={'/profile/' + currentReview?.user?.id}
              >
                {currentReview?.user?.name}
              </a>
            </Col>
            <Col xs={3} className='pe-0' style={{ display: 'flex', justifyContent: 'end' }}>
              <label style={{ fontSize: '1.1rem' }}>
                {changeSingleDateToUserTimezone(currentReview?.createdAt)}
              </label>
            </Col>
          </Row>
        </Container>
        <div
          onClick={() => {
            viewReview(currentReview);
          }}
        >
          <div style={{ fontSize: '1.8rem' }}>{currentReview?.title}</div>

          <Container
            fluid
            style={{
              paddingTop: '10px',
              paddingBottom: '20px',
            }}
          >
            <Row>
              <Col md={'auto'}>
                <label className='review_category'>{currentReview?.category}</label>
              </Col>
              <Col className='tags_container'>
                <label className='review_tags'>{currentReview?.tags}</label>
              </Col>
              <Col md={'auto'} style={{ whiteSpace: 'nowrap' }}>
                <StarRatings
                  rating={currentReview?.authorScore}
                  starRatedColor='#ffd700'
                  numberOfStars={5}
                  starDimension='2rem'
                  name='rating'
                />
              </Col>
            </Row>
          </Container>

          <div>
            <ReactQuill theme={null} readOnly={true} value={editorText} />
          </div>
        </div>
      </div>
      <div className='review_shortened_feedback_container'>
        <Feedback review={currentReview} />
      </div>

      <CustomModal ref={reviewsModal} />
    </div>
  );
};
