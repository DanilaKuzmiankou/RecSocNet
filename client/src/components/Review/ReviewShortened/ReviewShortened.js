import { Image } from 'react-bootstrap';
import StarRatings from 'react-star-ratings/build/star-ratings';
import { useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill';
import { Feedback } from '../../Feedback/Feedback/Feedback';
import { setEditedReview } from '../../../store/reducers/ReviewSlice';
import { setModalParams } from '../../../store/reducers/ModalSlice';
import { CustomModal } from '../../CustomModal/CustomModal';
import { useDispatch, useSelector } from 'react-redux';
import { changeSingleDateToUserTimezone } from '../../../utils/Utils';
import { Link } from 'react-router-dom';
import './ReviewShortened.css';

export const ReviewShortened = (props) => {
  const reviewsModal = useRef();
  const dispatch = useDispatch();
  const reviews = useSelector((state) => state.review.reviews);
  const [editorText, setEditorText] = useState('');
  const [currentReview, setCurrentReview] = useState('');

  useEffect(() => {
    let isMounted = true;
    if (isMounted) {
      if (reviews[props.reviewId] !== undefined) {
        const shortenedText = formatText(props.currentReview?.text);
        const newReview = JSON.parse(JSON.stringify(reviews[props.reviewId]));
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
    <>
      <div
        className='review-shortened-body'
        onClick={() => {
          viewReview(currentReview);
        }}
      >
        <div className='review-shortened-user-body'>
          <h3 className='review-shortened-author-predicate'>by</h3>
          <Link className='review-shortened-profile-url' to={'/profile/' + currentReview?.user?.id}>
            {currentReview?.user?.name}
          </Link>
          <h2 className='review-shortened-date'>
            {changeSingleDateToUserTimezone(currentReview?.createdAt)}
          </h2>
        </div>
        <h2 className='review-shortened-title'>{currentReview?.title}</h2>
        <div>
          <div className='review-shortened-category-container'>
            <h3 className='review-category'>{currentReview?.category}</h3>
            <h3 className='review-shortened-tags'>{currentReview?.tags}</h3>
            <div className='review-shortened-rating-container'>
              <StarRatings
                rating={currentReview?.authorScore}
                starRatedColor='#ffd700'
                numberOfStars={5}
                starDimension='2rem'
                name='rating'
              />
            </div>
          </div>
          <ReactQuill theme={null} readOnly={true} value={editorText} />
          <div className='review-shortened-images-container'>
            {currentReview.images?.map((image, index) => (
              <div className='thumb-short' key={index}>
                <Image src={image.imageLink} className='review-img' />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className='review-shortened-feedback-container'>
        <Feedback review={currentReview} />
      </div>
      <CustomModal ref={reviewsModal} />
    </>
  );
};
