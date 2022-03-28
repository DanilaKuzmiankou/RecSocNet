import React, { useEffect, useState } from 'react';
import '../../App.css';
import {
  Button,
  Col,
  Container,
  Form,
  Image,
  InputGroup,
  OverlayTrigger,
  Row,
  Tooltip,
} from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import Rating from 'react-rating';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faEdit as editLight } from '@fortawesome/free-regular-svg-icons';
import { changeUserName } from '../../api/store/UserStore';
import { setBrowsedUser, setCurrentUser } from '../../store/reducers/UserSlice';
import { useTranslation } from 'react-i18next';
import { onImageDownloadError } from '../../utils/Utils';

export const UserProfile = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { currentUser, browsedUser, isCurrentUserAdmin, isCurrentUserOwner } = useSelector(
    (state) => state.user
  );
  const [edit, setEdit] = useState(false);
  const [editUsername, setEditUsername] = useState(browsedUser?.name);
  const [displayForm, setDisplayForm] = useState('none');
  const [validationMessage, setValidationMessage] = useState('');
  const [errorValidationMessage, setErrorValidationMessage] = useState('');
  const [isOverlayTriggerVisible, setIsOverlayTriggerVisible] = useState(false);
  const [imageGetAttempt, setImageGetAttempt] = useState(0);

  const showOrHideForm = () => {
    setEdit(!edit);
    setValidationMessage('');
    setErrorValidationMessage('');
    if (displayForm === '') {
      setEditUsername('');
      setDisplayForm('none');
    } else {
      setDisplayForm('');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const response = await changeUserName(browsedUser.authId, editUsername);
    if (response?.status === 200) {
      changeName(response);
    } else {
      setErrorValidationMessage(response.data.message);
    }
  };

  const changeName = (response) => {
    const newBrowsedUser = Object.assign({}, browsedUser);
    newBrowsedUser.name = editUsername;
    dispatch(setBrowsedUser(newBrowsedUser));
    if (currentUser.authId === browsedUser.authId) {
      changeCurrentUserName();
    }
    updateProfileUI(response);
  };

  const updateProfileUI = (response) => {
    setValidationMessage(response.data.message);
    setTimeout(async () => {
      setDisplayForm('none');
    }, 2000);
  };

  const changeCurrentUserName = () => {
    const newCurrentUser = Object.assign({}, currentUser);
    newCurrentUser.name = editUsername;
    dispatch(setCurrentUser(newCurrentUser));
  };

  const autoCloseTooltip = (value) => {
    if (value) {
      setIsOverlayTriggerVisible(true);
      setTimeout(async () => {
        setIsOverlayTriggerVisible(false);
      }, 700);
    }
  };

  return (
    <Container fluid className='no-select'>
      <Row>
        <Col xs={'auto'} md={'auto'}>
          <Image
            src={browsedUser.profilePictureUrl}
            height={150}
            width={150}
            onError={({ currentTarget }) =>
              onImageDownloadError(currentTarget, setImageGetAttempt, imageGetAttempt, browsedUser)
            }
          />
        </Col>
        <Col
          style={{ display: 'flex', alignItems: 'center', paddingTop: '10px' }}
          xs={'auto'}
          md={'auto'}
        >
          <div>
            <div className='profile-username-edit-container'>
              <Row>
                <Col xs={'auto'} md={'auto'} sm={12}>
                  {isCurrentUserAdmin || isCurrentUserOwner ? (
                    <OverlayTrigger
                      placement='right'
                      delay={{ show: 75, hide: 200 }}
                      onToggle={autoCloseTooltip}
                      show={isOverlayTriggerVisible}
                      overlay={<Tooltip id='tooltip-disabled'>{t('change_name')}</Tooltip>}
                    >
                      <div className='profile-username-edit-container'>
                        <h4 className=''>
                          {' '}
                          {t('name')}: {browsedUser.name}{' '}
                        </h4>

                        <Rating
                          style={{ marginLeft: '9px' }}
                          start={0}
                          stop={1}
                          initialRating={edit}
                          onClick={showOrHideForm}
                          emptySymbol={
                            <FontAwesomeIcon icon={editLight} color={'black'} size='1x' />
                          }
                          fullSymbol={<FontAwesomeIcon icon={faEdit} size='1x' color={'black'} />}
                        />
                      </div>
                    </OverlayTrigger>
                  ) : (
                    <h4 className=''>
                      {t('name')}: {browsedUser.name}{' '}
                    </h4>
                  )}
                  <h4 className=''>
                    {t('likes')}: {browsedUser.likes}{' '}
                  </h4>
                </Col>
                <Col md={6} sm={12}>
                  <Form
                    onSubmit={handleSubmit}
                    style={{ display: displayForm }}
                    className='profile-username-edit-container'
                  >
                    <Form.Group className='profile_username_field'>
                      <InputGroup hasValidation>
                        <Form.Control
                          required
                          value={editUsername}
                          id='inlineFormInputName'
                          placeholder={t('enter_new_name')}
                          isInvalid={errorValidationMessage}
                          isValid={validationMessage}
                          onChange={(e) => {
                            setErrorValidationMessage('');
                            setValidationMessage('');
                            setEditUsername(e.target.value);
                          }}
                        />
                        <Form.Control.Feedback type='valid'>
                          {validationMessage}
                        </Form.Control.Feedback>
                        <Form.Control.Feedback type='invalid'>
                          {errorValidationMessage}
                        </Form.Control.Feedback>
                      </InputGroup>
                    </Form.Group>
                    <Button
                      className='profile-username-submit-button'
                      type='submit'
                      variant='success'
                    >
                      {t('submit')}
                    </Button>
                  </Form>
                </Col>
              </Row>
            </div>
          </div>
        </Col>
      </Row>
    </Container>
  );
};
