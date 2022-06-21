import React from 'react';
import '../../App.css';
import { Container, Image } from 'react-bootstrap';
import StarRatings from 'react-star-ratings/build/star-ratings';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import ReactQuill from 'react-quill';
import { useSelector } from 'react-redux';
import { changeSingleDateToUserTimezone } from '../../utils/Utils';
import { Link } from 'react-router-dom';

export const Review = (props) => {
  const { editedReview } = useSelector((state) => state.review);

  const closeModal = () => {
    props.closeModal();
  };

  return (
    <div>
      <FontAwesomeIcon size='lg' icon={faArrowLeft} onClick={closeModal} />
      <Container fluid>
        <div className='review-container'>
          <div style={{ display: 'flex', flexDirection: 'row' }}>
            {editedReview.user?.name && (
              <div
                style={{
                  display: 'flex',
                  flexShrink: '0',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}
              >
                <label style={{ fontSize: '33px', fontStyle: 'italic' }}>by</label>
                <Link
                  style={{
                    marginLeft: '6px',
                    fontSize: '43px',
                    fontStyle: 'italic',
                  }}
                  className='review-shortened-profile-url'
                  to={'/profile/' + editedReview?.user?.id}
                >
                  {editedReview?.user?.name}
                </Link>
              </div>
            )}
            <div style={{ display: 'flex', flex: '1' }}> </div>
            <div style={{ display: 'flex', flexShrink: '0' }}>
              <label style={{ fontSize: '23px' }}>
                {changeSingleDateToUserTimezone(editedReview?.createdAt)}
              </label>
            </div>
          </div>
          <h1>{editedReview.title}</h1>

          <div
            style={{
              paddingTop: '10px',
              paddingBottom: '20px',
            }}
          >
            <label className='review-category'>{editedReview.category}</label>
            <label className='review-tags'>{editedReview.tags}</label>
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

          <div>
            <ReactQuill theme={null} readOnly={true} defaultValue={editedReview.text} />
          </div>

          {editedReview.images?.map((image, index) => (
            <div className='thumb' key={index}>
              <div className='thumb-inner'>
                <Image src={image.imageLink} className='review-img' />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
};
