import { Button, Container, Modal } from 'react-bootstrap';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import '../../App.css';
import { CreateOrEditReviewForm } from '../Review/CreateOrEditReviewForm';
import { useSelector } from 'react-redux';
import { Review } from '../Review/Review';

// eslint-disable-next-line react/display-name
export const CustomModal = forwardRef((props, ref) => {
  const params = useSelector((state) => state.modal.params);

  const formRef = useRef();

  const [showModal, setShowModal] = useState(false);

  const handleModalSaveChanges = async () => {
    if (formRef.current && formRef) {
      console.log(formRef.current);
      const result = await formRef.current.submitForm();
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
            {params.displayEditForm && <CreateOrEditReviewForm formRef={formRef} />}
            {params.displayViewForm && <Review closeModal={closeModal} />}
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
