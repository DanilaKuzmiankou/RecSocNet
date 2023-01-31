import { Button, Container, Modal } from 'react-bootstrap';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
import './CustomModal.css';
import { CreateOrEditReviewForm, Review } from '../index.components';
import { useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

// eslint-disable-next-line react/display-name
export const CustomModal = forwardRef((props, ref) => {
  const params = useSelector((state) => state.modal.params);
  const { t } = useTranslation();
  const formRef = useRef();
  const [showModal, setShowModal] = useState(false);

  const handleModalSaveChanges = async () => {
    if (formRef.current && formRef) {
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
    <Modal
      show={showModal}
      aria-labelledby='contained-modal-title-vcenter'
      centered
      size='xl'
      backdrop={params.backdrop}
      keyboard={false}
      className='no-select'
      onHide={closeModal}
      scrollable={true}
    >
      <Modal.Header
        className='custom-modal'
        style={{ display: params.displayHeader }}
        closeButton
        onClick={closeModal}
      >
        <Modal.Title>{params.title}</Modal.Title>
      </Modal.Header>
      <Modal.Body className='custom-modal'>
        <Container>
          {params.displayEditForm && <CreateOrEditReviewForm formRef={formRef} />}
          {params.displayViewForm && <Review closeModal={closeModal} />}
        </Container>
      </Modal.Body>

      <Modal.Footer className='custom-modal' style={{ display: params.displayModalButtons }}>
        <Button size='lg' variant='secondary' onClick={closeModal}>
          {t('close')}
        </Button>
        <Button size='lg' variant='primary' onClick={handleModalSaveChanges}>
          {t('save_changes')}
        </Button>
      </Modal.Footer>
    </Modal>
  );
});
