import { Button, Container, Modal } from 'react-bootstrap';
import React, { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import '../../App.css';
import { CreateOrEditReviewForm } from '../Review/CreateOrEditReviewForm';
import { useSelector } from 'react-redux';
import { Review } from '../Review/Review';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react/display-name
export const CustomModal = forwardRef((props, ref) => {
  const params = useSelector((state) => state.modal.params);
  const { t } = useTranslation();
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
        <Modal.Header
          className='custom_modal'
          style={{ display: params.displayHeader }}
          closeButton
          onClick={closeModal}
        >
          <Modal.Title>{params.title}</Modal.Title>
        </Modal.Header>
        <Modal.Body className='custom_modal'>
          <Container>
            {params.displayEditForm && <CreateOrEditReviewForm formRef={formRef} />}
            {params.displayViewForm && <Review closeModal={closeModal} />}
          </Container>
        </Modal.Body>

        <Modal.Footer className='custom_modal' style={{ display: params.displayModalButtons }}>
          <Button variant='secondary' onClick={closeModal}>
            {t('close')}
          </Button>
          <Button variant='primary' onClick={handleModalSaveChanges}>
            {t('save_changes')}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
});
