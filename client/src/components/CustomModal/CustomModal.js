/* eslint-disable */
import { Button, Container, Modal } from 'react-bootstrap';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import '../../App.css';
import { CreateOrEditReviewForm } from '../Review/CreateOrEditReviewForm';
import {
  addImagesToDatabase,
  deleteImagesFromFirebaseCloud,
  uploadImagesToFirebaseCloud,
} from '../../api/store/ReviewStore';
import { useDispatch, useSelector } from 'react-redux';
import { LoadingComponent } from '../index.components';
import { setIsLoading } from '../../store/reducers/LoadingSlice';
import { Review } from '../Review/Review';

// eslint-disable-next-line react/display-name
export const CustomModal = forwardRef((props, ref) => {
  const editedReview = useSelector((state) => state.review.editedReview);
  const isLoading = useSelector((state) => state.loading.isLoading);
  const params = useSelector((state) => state.modal.params);
  const user = useSelector((state) => state.user.browsedUser);

  const formRef = useRef();

  const [showModal, setShowModal] = useState(false);

  const handleModalSaveChanges = async () => {
    if (formRef.current && formRef) {
      console.log(formRef.current);
      let result = await formRef.current.submitForm();
      console.log('result got', result);
      if (result) {
        closeModal();
      }
    }
  };

  useImperativeHandle(ref, () => ({
    showReviewModal() {
      setShowModal(true);
    },
  }));

  const closeModal = () => {
    setShowModal(false);
  };

  return (
    <div>
      {isLoading && <LoadingComponent />}
      <Modal
        show={showModal}
        aria-labelledby='contained-modal-title-vcenter'
        centered
        size='xl'
        backdrop={params.backdrop}
        keyboard={false}
        className='no_select'
        onHide={closeModal}
        scrollable={true}
      >
        <Modal.Header style={{ display: params.displayHeader }} closeButton onClick={closeModal}>
          <Modal.Title>{params.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Container>
            {params.displayEditForm && (
              <CreateOrEditReviewForm formRef={formRef} review={editedReview} modeCreate={false} />
            )}
            {params.displayCreateForm && (
              <CreateOrEditReviewForm formRef={formRef} modeCreate={true} />
            )}
            {params.displayViewForm && (
              <Review user={user} review={editedReview} closeModal={closeModal} />
            )}
          </Container>
        </Modal.Body>

        <Modal.Footer style={{ display: params.displayModalButtons }}>
          <Button variant='secondary' onClick={closeModal}>
            Close
          </Button>
          <Button variant='primary' onClick={handleModalSaveChanges}>
            Save Changes
          </Button>
        </Modal.Footer>

        {/*  <Modal.Footer style={{display: params.displayModalFeedback, backgroundColor: "#EEF1F0"}}>
                    <Feedback review={editedReview}/>
                </Modal.Footer>*/}
      </Modal>
    </div>
  );
});
