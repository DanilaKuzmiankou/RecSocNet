import React from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import '../../../App.css';
import { useTranslation } from 'react-i18next';

export const LogoutButton = () => {
  const { logout } = useAuth0();
  const { t } = useTranslation();
  return (
    <button
      className='btn btn-danger btn-block AuthBtn'
      onClick={() =>
        logout({
          returnTo: window.location.origin,
        })
      }
    >
      {t('log_out')}
    </button>
  );
};

export default LogoutButton;
