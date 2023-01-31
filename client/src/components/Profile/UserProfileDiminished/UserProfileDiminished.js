import { useState } from 'react';
import { Image, NavDropdown } from 'react-bootstrap';
import { useAuth0 } from '@auth0/auth0-react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { formatStringLength, onImageDownloadError } from '../../../utils/Utils';
import { setCurrentUser } from '../../../store/reducers/UserSlice';
import { Link, useNavigate } from 'react-router-dom';
import blankProfilePicture from '../../../assets/pictures/blankProfilePicture.png';

export const UserProfileDiminished = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const { logout } = useAuth0();
  const navigate = useNavigate();
  const { currentUser, isCurrentUserAdmin } = useSelector((state) => state.user);
  const [imageGetAttempt, setImageGetAttempt] = useState(0);

  const logOut = () => {
    dispatch(setCurrentUser({}));
    logout({
      returnTo: window.location.origin,
    });
  };

  return (
    currentUser && (
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          textAlign: 'center',
        }}
      >
        <Image
          src={currentUser?.profilePictureUrl || blankProfilePicture}
          height={50}
          width={50}
          roundedCircle={true}
          onClick={() => navigate('/profile/' + currentUser?.id)}
          onError={({ currentTarget }) =>
            onImageDownloadError(currentTarget, setImageGetAttempt, imageGetAttempt, currentUser)
          }
        />
        <div style={{ width: 'auto' }}>
          <NavDropdown
            style={{ fontSize: '30px' }}
            title={formatStringLength(currentUser?.name, 30)}
            id='navbarScrollingDropdown'
          >
            <>
              <NavDropdown.Item as={Link} to={'/profile/' + currentUser?.id}>
                {t('profile')}
              </NavDropdown.Item>
              <NavDropdown.Divider />
            </>
            {isCurrentUserAdmin && (
              <>
                <NavDropdown.Item as={Link} to='/admin'>
                  {t('admin_page')}
                </NavDropdown.Item>
                <NavDropdown.Divider />
              </>
            )}
            <NavDropdown.Item onClick={logOut}>{t('log_out')}</NavDropdown.Item>
          </NavDropdown>
        </div>
      </div>
    )
  );
};
