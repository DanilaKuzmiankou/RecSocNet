import './Review.css';
import { Container, Image } from 'react-bootstrap';
import StarRatings from 'react-star-ratings/build/star-ratings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import { changeSingleDateToUserTimezone } from '../../../utils/Utils';
import { Link } from 'react-router-dom';

export const Review = (props) => {
  const { editedReview } = useSelector((state) => state.review);

  const closeModal = () => {
    props.closeModal();
  };

  return (
    <>
      <FontAwesomeIcon size='lg' icon={faArrowLeft} onClick={closeModal} />
      <Container fluid>
        <div className='review-container'>
          <div className='review-body'>
            {editedReview.user?.name && (
              <>
                <h2 className='review-author-predicate'>by</h2>
                <Link
                  className='review-shortened-profile-url review-author'
                  to={'/profile/' + editedReview?.user?.id}
                >
                  {editedReview?.user?.name}
                </Link>
              </>
            )}
            <h2 className='review-date'>
              {changeSingleDateToUserTimezone(editedReview?.createdAt)}
            </h2>
          </div>

          <h1 className='review-title'>{editedReview.title}</h1>

          <div className='review-feedback-container'>
            <h2 className='review-category'>{editedReview.category}</h2>
            <h2 className='review-tags'>{editedReview.tags}</h2>
            <div className='review-rating-container'>
              <StarRatings
                rating={editedReview.authorScore}
                starRatedColor='#ffd700'
                numberOfStars={5}
                starDimension='30px'
                name='rating'
              />
            </div>
          </div>

          <ReactQuill
            className='review-quill'
            theme={null}
            readOnly
            defaultValue={editedReview.text}
          />

          {editedReview.images?.map((image, index) => (
            <div className='thumb' key={index}>
              <Image src={image.imageLink} className='review-img' />
            </div>
          ))}
        </div>
      </Container>
    </>
  );
};
