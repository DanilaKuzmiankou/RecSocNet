import { useState } from 'react';
import './UserProfile.css';
import { Button, Form, Image, InputGroup, OverlayTrigger, Tooltip } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { faEdit as editLight } from '@fortawesome/free-regular-svg-icons';
import { changeUserName } from '../../../api/store/UserStore';
import { setBrowsedUser, setCurrentUser } from '../../../store/reducers/UserSlice';
import { useTranslation } from 'react-i18next';
import { onImageDownloadError } from '../../../utils/Utils';
import blankProfilePicture from '../../../assets/pictures/blankProfilePicture.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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
  const [currentIcon, setCurrentIcon] = useState(editLight);

  const showOrHideForm = () => {
    setCurrentIcon(currentIcon === editLight ? faEdit : editLight);
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
    <div className='profile-container'>
      <Image
        src={browsedUser?.profilePictureUrl || blankProfilePicture}
        height={150}
        width={150}
        onError={({ currentTarget }) =>
          onImageDownloadError(currentTarget, setImageGetAttempt, imageGetAttempt, browsedUser)
        }
      />
      <div className='profile-content-container'>
        {isCurrentUserAdmin || isCurrentUserOwner ? (
          <>
            <OverlayTrigger
              placement='right'
              delay={{ show: 75, hide: 200 }}
              onToggle={autoCloseTooltip}
              show={isOverlayTriggerVisible}
              overlay={<Tooltip id='tooltip-disabled'>{t('change_name')}</Tooltip>}
            >
              <div className='profile-edit-name-container'>
                <h4>
                  {t('name')}: {browsedUser?.name}
                </h4>
                <FontAwesomeIcon size='2x' icon={currentIcon} onClick={showOrHideForm} />
              </div>
            </OverlayTrigger>
            <Form
              onSubmit={handleSubmit}
              style={{ display: displayForm }}
              className='profile-edit-name-form'
            >
              <Form.Group>
                <InputGroup hasValidation>
                  <Form.Control
                    required
                    value={editUsername}
                    className='profile-form-input'
                    placeholder={t('enter_new_name')}
                    isInvalid={errorValidationMessage}
                    isValid={validationMessage}
                    onChange={(e) => {
                      setErrorValidationMessage('');
                      setValidationMessage('');
                      setEditUsername(e.target.value);
                    }}
                  />
                  <Form.Control.Feedback className='feedback-message-box' type='valid'>
                    {validationMessage}
                  </Form.Control.Feedback>
                  <Form.Control.Feedback className='feedback-message-box' type='invalid'>
                    {errorValidationMessage}
                  </Form.Control.Feedback>
                </InputGroup>
              </Form.Group>
              <Button className='profile-username-submit-button' type='submit' variant='success'>
                {t('submit')}
              </Button>
            </Form>
          </>
        ) : (
          <h4>
            {t('name')}: {browsedUser?.name}
          </h4>
        )}
        <h4>
          {t('likes')}: {browsedUser?.likes}
        </h4>
      </div>
    </div>
  );
};
